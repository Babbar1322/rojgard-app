import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
// import { DataTable } from 'react-native-paper';
import styles from '../../config/styles';
import { selectUserId } from '../../redux/slice/authSlice';
import { api, color } from '../../config/config';
import AnimatedLottieView from 'lottie-react-native';
import { Loading } from '../../components/lottie';
import { Table, TableWrapper, Cell, Row } from 'react-native-table-component';
import moment from 'moment';

export default function LevelIncome() {
    const [data, setData] = useState([]);
    const [noData, setNoData] = useState(false);
    const [balance, setBalance] = useState(0);
    const userId = useSelector(selectUserId);
    const [loading, setLoading] = useState(false);

    const tableHead = ['From', 'Name', 'Amount', 'Description', 'Date'];
    const widthArr = [160, 160, 160, 160, 160];

    const getData = async () => {
        setLoading(true);
        setNoData(false);
        await axios.get(api + 'levelIncome/' + userId).then(res => {
            let players = res.data.details.map(data => {
                return [data.from, data.user.name, data.amount, data.description, moment(data.created_at).format('DD-MM-YYYY') ];
              });
              if(res.data.details.length === 0){
                setNoData(true);
              }
            setData(players);
            setBalance(res.data.balance);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            throw new Error(err);
        });
    }

    const screen = () => {
        if (loading) {
            return (
                <AnimatedLottieView source={Loading} autoPlay loop style={{ flex: 1, width: '30%', alignSelf: 'center', marginTop: '40%' }} />
            )
        } else {
            return (
                <ScrollView horizontal={true}>
                    <View>
                        <ScrollView>

                            <Table
                                borderStyle={{
                                    borderWidth: 1,
                                    borderColor: color.grey,
                                }}>
                                <Row
                                    widthArr={widthArr}
                                    data={tableHead}
                                    style={{ height: 42, backgroundColor: color.red }}
                                    textStyle={{ margin: 6, fontSize: 12, color: color.white, fontWeight: 'bold', textAlign: 'center' }}
                                />
                                {data.map((rowData, index) => (
                                    <TableWrapper key={index} style={{ flexDirection: 'row' }}>
                                        {rowData.map((cellData, cellIndex) => (
                                            <Cell
                                                key={cellIndex}
                                                data={
                                                    cellIndex === 6
                                                        ? element(cellData, index)
                                                        : cellData
                                                }
                                                width={160}
                                                textStyle={{ margin: 4, fontSize: 12, color: color.black, paddingVertical: 3, fontWeight: '400', textAlign: 'center' }}
                                            />
                                        ))}
                                    </TableWrapper>
                                ))}
                            </Table>
                        </ScrollView>
                    </View>
                </ScrollView>
            )
        }
    }
    useEffect(() => {
        getData();
    }, []);
    return (
        <View style={styles.container}>
            <View style={{ paddingVertical: '5%' }}>
                <Text style={[styles.bold, styles.text_center, { fontSize: 16 }]}>Level Income</Text>
            </View>
            <ScrollView style={{ flex: 1, marginHorizontal: '5%' }} showsVerticalScrollIndicator={false}>
                <Text style={[styles.bold, { textAlign: 'right', marginVertical: '2%', marginRight: '5%' }]}>Total Level Income: {balance}</Text>
                {screen()}
                {noData ?
                    <>
                        <AnimatedLottieView source={require('../../../assets/Lottie/noData.json')} autoPlay loop style={{ flex: 1, width: '70%', alignSelf: 'center', marginTop: '20%' }} />
                        <Text style={[styles.bold, styles.text_center]}>Sorry, No Data Found</Text>
                    </>
                    : null}
            </ScrollView>
            <View style={{ position: 'absolute', bottom: '-25%', left: '-20%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
            <View style={{ position: 'absolute', top: '-30%', right: '-5%' }}>
                <Image source={require('../../../assets/Images/circle.png')} style={{ zIndex: -1 }} />
            </View>
            <View style={{ position: 'absolute', bottom: '-2%', right: '0%' }}>
                <Image source={require('../../../assets/Images/dots.png')} style={{ width: 150, height: 50, resizeMode: 'contain', zIndex: -1 }} />
            </View>
        </View>
    )
}