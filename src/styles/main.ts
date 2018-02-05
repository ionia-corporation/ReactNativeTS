import { StyleSheet, ViewStyle, TextStyle, Dimensions, ImageStyle, Platform } from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const paragraph = {
  paddingTop: 10,
  paddingBottom: 10,
  paddingLeft: 20,
  paddingRight: 20,
} as TextStyle;

const errorMessage = Object.assign({}, paragraph, {
  color: '#FF4833',
} as TextStyle);

export const Styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  } as ViewStyle,

  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  } as TextStyle,

  logo: {
    marginBottom: 50,
  } as ImageStyle,

  subtitle: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  } as TextStyle,

  input: {
    backgroundColor: 'rgba(200, 200, 200, 0.4)',
    height: 40,
    paddingLeft: 45,
    borderRadius: 20,
    color: '#333333',
  },

  inputWrapper: {
    width: DEVICE_WIDTH,
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  } as ViewStyle,

  deviceConnectedImage: {
    marginTop: 2,
  } as TextStyle,

  listContainer: {
    width: DEVICE_WIDTH,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
  } as ViewStyle,

  listItem: {
    padding: 5,
    paddingTop: 10,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#dce0e6',
    marginBottom: 10,
    backgroundColor: '#ffffff',
  } as ViewStyle,

  listItemText: {
    paddingLeft: 15,
    paddingBottom: 4,
  } as TextStyle,

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingLeft: 5,
  } as TextStyle,

  sectionDescription: {
    paddingTop: 5,
    paddingLeft: 5,
  } as TextStyle,

  sectionStatus: {
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: 'center',
    color: '#333333',
  } as TextStyle,

  link: {
    color: '#11A0F8',
  } as TextStyle,

  paragraph,

  errorMessage,

  switchContainer: {
    width: DEVICE_WIDTH,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    paddingLeft: 25,
    marginTop: -5,
    paddingTop: 0,
  } as ViewStyle,
});

export default Styles;
