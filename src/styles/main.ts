import { StyleSheet, ViewStyle, TextStyle, Dimensions, ImageStyle, Platform } from "react-native";

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export const Styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'ios' ? 20 : 0,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    } as ViewStyle,

    title: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
    } as TextStyle,

    logo: {
        marginBottom: 50,
    } as ImageStyle,

    subtitle: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5,
    } as TextStyle,

    input: {
		backgroundColor: 'rgba(200, 200, 200, 0.4)',
		width: DEVICE_WIDTH - 40,
		height: 40,
		marginHorizontal: 20,
		paddingLeft: 45,
		borderRadius: 20,
		color: '#333333',
	},
    inputWrapper: {
        paddingBottom: 10,
    },
    deviceRow: {
        padding: 4,
        borderWidth: 0.5,
        borderRadius: 2,
        borderColor: '#eeeeee',
        margin: 2,
    } as TextStyle,
    deviceConnectedImage: {
        marginTop: 2,
    },
    deviceRowText: {
        paddingLeft: 15,
        paddingBottom: 4,
    } as TextStyle,
    groupRow: {
        padding: 4,
        borderWidth: 0.5,
        borderRadius: 2,
        borderColor: '#eeeeee',
        margin: 2,
    } as TextStyle,
    groupRowText: {
        paddingLeft: 15,
        paddingBottom: 4,
    } as TextStyle,
});

export default Styles;