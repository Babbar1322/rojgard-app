import { Dimensions } from "react-native";

const SW = Math.round(Dimensions.get('window').width);
const SH = Math.round(Dimensions.get('window').height);

const color = {
    red: '#FA5703',
    grey: '#232323',
    white: '#ffffff',
    black: '#000000'
};

const api = "https://rojgar.biz/api/"

export {SW, SH, color, api};