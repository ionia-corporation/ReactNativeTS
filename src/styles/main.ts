import { StyleSheet, ViewStyle, TextStyle, Dimensions, ImageStyle, Platform } from "react-native";

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export const Styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'ios' ? 20 : 0,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
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
    } as TextStyle,

    deviceConnectedImage: {
        marginTop: 2,
    } as TextStyle,

    listContainer: {
        paddingTop: 20,
    } as ViewStyle,

    listItem: {
        padding: 5,
        paddingTop: 10,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#dce0e6',
        margin: 2,
        backgroundColor: '#ffffff'
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
    } as TextStyle,
});

export default Styles;