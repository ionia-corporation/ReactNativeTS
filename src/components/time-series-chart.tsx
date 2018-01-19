import * as React from 'react';
import { View, Text } from 'react-native';
import { groupBy } from 'lodash';
import randomColor from 'randomcolor';
import moment from 'moment';
import {
  VictoryChart,
  VictoryLine,
  VictoryVoronoiContainer,
  VictoryTooltip,
  VictoryAxis
} from 'victory-native';

import { TimeSeries } from '../lib/xively/models/timeseries';
import Styles from '../styles/main';

interface State {
}

interface Props {
  title: string;
  description: string;
  data?: Array<TimeSeries.DataPoint> | 'error';
}

export class TimeSeriesChart extends React.Component<Props, State> {
  formatData(rawData: Array<TimeSeries.DataPoint>) {
    let formattedData = [];
    let fields: string[] = [];

    // group rawData by time
    let groupedData = groupBy(rawData, ((dp) => dp.time));
    // iterate groupded rawData and create formattedData
    for (let key in groupedData) {
      let fData = {
        time: Date.parse(key),
      };
      groupedData[key].forEach((dp) => {
        if (fields.indexOf(dp.category) < 0) {
          fields.push(dp.category);
        }
        fData[dp.category] = dp.numericValue;
      });
      formattedData.push(fData);
    }

    return { data: formattedData, fields };
  }

  render() {
    const {
      data,
      description,
      title,
    } = this.props;

    let content;

    if (!data) {
      content = <Text style={Styles.sectionLoading}>Loading data...</Text>;
    } else if (data === 'error') {
      content = <Text>There was an error loading data</Text>;
    } else {
      const formattedData = this.formatData(data);

      content = (
        <VictoryChart
          scale={{ x: 'time' }}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension='x'
              labels={
                (datum) => {
                  return `${datum.l}: ${datum.y}`;
                }
              }
              labelComponent={<CustomTooltip/>}
            />
          }
        >
          <VictoryAxis
            domain={{
              x: [formattedData.data[0].time, formattedData.data[formattedData.data.length - 1].time]
            }}
            standalone={false}
            style={{ tickLabels: { padding: 15, angle: -45, fontSize: 12 } }}
          />

          <VictoryAxis
            dependentAxis
            offsetX={-1}
            style={{
              grid: {stroke: 'grey'},
            }}
          />

          {
            formattedData.fields.map((field, i) => {
              const color = randomColor({ seed: field });

            	return (
                <VictoryLine
                  style={{
                    data: { stroke: color },
                    labels: { fill: color }
                  }}
                  data={
                    formattedData.data.filter((item) => {
                      return item[field];
                    }).map((item) => {
                      return {
                        time: item.time,
                        l: field,
                        [field]: item[field]
                      };
                    })
                  }
                  x='time'
                  y={field}
                  key={i}
                />
            	)
            })
          }
        </VictoryChart>
      );
    }

    return (
      <View>
        <Text style={Styles.sectionTitle}> {title} </Text>
        <Text style={Styles.sectionDescription}> {description} </Text>

        { content }
      </View>
    );
  }
}

const CustomTooltip = (prop) => {
  prop.text.unshift(moment(prop.x).format('MM/DD/YY HH:mm'));

  prop.style.unshift({
    fill:'black',
  	fontFamily:'"Gill Sans", "Gill Sans MT", "Ser­avek", "Trebuchet MS", "sans-serif"',
	  fontSize:14,
	  letterSpacing:'normal',
	  padding:5,
	  pointerEvents:'none',
	  stroke:'transparent',
	  textAnchor:'middle'
  });

  return <VictoryTooltip
  	cornerRadius={0}
    {...prop}
    flyoutStyle={{ fill: 'white' }}
  />
}