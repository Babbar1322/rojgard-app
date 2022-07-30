import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styles from '../../config/styles';
import { selectUserId } from '../../redux/slice/authSlice';
import { api, color } from '../../config/config';
import AnimatedLottieView from 'lottie-react-native';
import { Loading } from '../../components/lottie';
import { Table, TableWrapper, Cell, Row } from 'react-native-table-component';
import moment from 'moment';

export default function Downline() {
    const [data, setData] = useState([]);
    const userId = useSelector(selectUserId);
    const [loading, setLoading] = useState(false);
    const [noData, setNoData] = useState(null);

    const tableHead = ['User ID', 'Name', 'Email', 'Phone', 'Level', 'Join Date'];
    const widthArr = [150, 150, 150, 150, 150, 150];

    const getData = async () => {
        setLoading(true);
        setNoData(false);
        await axios.get(api + 'downline/' + userId).then(res => {
            if (res.data.data.length === 0) {
                setNoData(true);
            }
            if (res.status === 500) {
                alert('Something went wrong!');
            }
            let players = res.data.data.map(data => {
                return [data.userId, data.user.name, data.user.email, data.user.phone, data.level, moment(data.created_at).format('DD/MM/YYYY')];
            });
            setData(players);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.log(err);
            if (err.toString().endsWith('500')) {
                alert('Something went wrong!')
            }
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
                        <ScrollView style={styles.dataWrapper}>

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
                                                width={150}
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
            <View style={{ paddingHorizontal: '5%', paddingVertical: '5%' }}>
                <Text style={[styles.bold, { textAlign: 'center', fontSize: 16 }]}>Downline</Text>
            </View>
            <ScrollView style={{flex: 1, marginHorizontal: '5%'}} showsVerticalScrollIndicator={false}>
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