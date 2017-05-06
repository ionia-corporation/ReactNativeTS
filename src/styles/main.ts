import { StyleSheet, ViewStyle, TextStyle } from "react-native";

export const Styles = StyleSheet.create({
    container: {
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

    subtitle: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5,
    } as TextStyle,
});

export default Styles;