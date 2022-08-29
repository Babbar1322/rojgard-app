import { StyleSheet, StatusBar, Platform } from "react-native";
import { color } from "./config";

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.white,
        flex: 1,
    },
    logo: {
        width: '40%',
        height: '25%',
        resizeMode: 'contain'
    },
    shadow: {
        shadowColor: color.black,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 20,
    },
    items_center: {
        alignItems: 'center'
    },
    h1: {
        fontSize: 20,
    },
    bold: {
        fontWeight: 'bold'
    },
    medium: {
        fontWeight: '400'
    },
    input: {
        // width: '80%',
        borderRadius: 30,
        paddingHorizontal: '5%',
        paddingVertical: '3%',
        backgroundColor: color.white,
        marginVertical: '3%',
        borderBottomColor: color.red,
        borderBottomWidth: 1
    },
    my: {
        marginVertical: '5%'
    },
    btn: {
        backgroundColor: color.red,
        paddingVertical: '3%',
        borderRadius: 30
    },
    btn_outline: {
        backgroundColor: color.white,
        paddingVertical: '3%',
        borderRadius: 30,
        borderColor: color.red,
        borderWidth: 2
    },
    welcome_btn: {
        backgroundColor: color.red,
        borderRadius: 20,
        paddingVertical: '5%',
        paddingHorizontal: '5%',
        justifyContent: 'space-between'
    },
    text_center: {
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    shadow_sm: {
        shadowColor: color.black,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    pill: {
        paddingVertical: '4%',
        paddingHorizontal: '3%',
        marginVertical: '3%',
        borderRadius: 3,
        backgroundColor: '#fff',
    },
    filePill: {
        paddingVertical: '5%',
        alignItems: 'center',
        width: '31%',
        marginVertical: '3%',
        borderRadius: 30,
        backgroundColor: '#fff',
        shadowColor: color.black,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    circle: {
        paddingVertical: '25%',
        paddingHorizontal: '5%',
        backgroundColor: color.red,
        alignItems: 'center',
        borderRadius: 200
    },
    justifyAround: {
        justifyContent: 'space-around'
    },
    justifyBetween: {
        justifyContent: 'space-between'
    },
    justifyCenter: {
        justifyContent: 'center'
    },
    listContainer: {
        marginHorizontal: '2%',
        backgroundColor: '#fff',
        paddingTop: '5%',
        width: '95%'
    },
    listItem: {
        width: '95%',
        paddingVertical: '4%',
        paddingHorizontal: '4%',
        marginVertical: '2%',
        marginHorizontal: '2.5%',
        backgroundColor: 'white',
        borderRadius: 10
    },
    tableHeader: {
        backgroundColor: color.red + '50'
    },
    btn_sm: {
        backgroundColor: color.red,
        paddingVertical: '2%',
        borderRadius: 30,
        maxWidth: '40%'
    },
    detailsView: {
        borderRadius: 20,
        backgroundColor: '#fff',
        marginHorizontal: '5%',
        paddingVertical: '3%',
        paddingHorizontal: '3%',
        marginVertical: '2%'
    },
    chatRight: {
        maxWidth: '70%',
        backgroundColor: color.red,
        paddingVertical: '2%',
        paddingHorizontal: '3%',
        borderRadius: 30,
        marginVertical: '2%',
        alignSelf: 'flex-end'
    },
    chatLeft: {
        maxWidth: '70%',
        backgroundColor: color.white,
        paddingVertical: '2%',
        paddingHorizontal: '3%',
        borderRadius: 30,
        marginVertical: '2%',
        alignSelf: 'flex-start',
        borderColor: color.red,
        borderWidth: 2
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        borderRadius: 300,
        borderWidth: 2,
        borderColor: color.red,
        alignSelf: 'center',
        marginVertical: '5%'
    },
    card: {
        paddingVertical: 60,
        paddingHorizontal: '10%',
        borderRadius: 20
    }
});

export default styles;