import React, {useEffect, useMemo, useState} from 'react';

import {Center, Divider, Skeleton} from 'native-base';
import {BarChart, PieChart} from 'react-native-gifted-charts';
import {useSelector} from 'react-redux';

import BackIcon from '../../assets/icons/arrow-left-black.svg';
import {n_f} from '../../utils/helpers';
import {getDailyAverage, getMonthlyReport} from '../../utils/https/admin';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from '../../utils/wrapper/nativewind';

const AdminDashboard = () => {
  const auth = useSelector(state => state.auth);
  const controller = useMemo(() => new AbortController(), []);
  const [dailyAvg, setDailyAvg] = useState([]);
  const [loadDa, setLoadDa] = useState(true);
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [loadMr, setLoadMr] = useState(true);

  function getMonthLabel(month) {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthIndex = parseInt(month) - 1;
    const abbreviatedMonth = monthNames[monthIndex].substr(0, 3);
    return abbreviatedMonth;
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoadMr(true);
        const mrResult = await getMonthlyReport(auth?.data?.token, controller);

        const mrConverted = mrResult?.data?.data?.map(item => ({
          value: parseInt(item.total_sum),
          label: getMonthLabel(item.month),
        }));
        setMonthlyReport(mrConverted);
        setLoadMr(false);

        setLoadDa(true);
        const daResult = await getDailyAverage(auth.data.token, controller);
        const daConverted = daResult?.data?.data?.map(item => ({
          value: parseInt(item.average),
          label: item.day_name.charAt(0),
        }));
        setDailyAvg(daConverted);
        setLoadDa(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadMr(false);
        setLoadDa(false);
      }
    };
    fetch();
    // getDailyAverage(auth.data.token, controller)
    //   .then(result => {
    //     console.log(result.data.data);
    //     const {data} = result.data;

    //     const convertedData = data.map(item => ({
    //       value: parseInt(item.average),
    //       label: item.day_name.charAt(0),
    //     }));
    //     setDailyAvg(convertedData);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   })
    //   .finally(() => setLoadDa(false));

    return () => controller.abort(); // abort while change
  }, []);

  const pieData = [
    {value: 70, color: '#ffba33'},

    {value: 30, color: 'lightgray'},
  ];
  return (
    <View className="flex-1 bg-[#ECECEC]">
      <View className="px-10 py-6 flex-row justify-between items-center">
        <Pressable onPress={() => nav.goBack()} className="pr-4">
          <BackIcon />
        </Pressable>
        <Text className="font-global text-black text-base font-bold">
          Sales Chart
        </Text>
        <Text></Text>
      </View>
      <ScrollView className="px-7">
        <Skeleton
          h={96}
          startColor={'gray.300'}
          endColor={'gray.400'}
          isLoaded={!loadMr && !loadDa}
          rounded={'xl'}>
          <View className="bg-white rounded-xl p-3">
            <Text className="font-global text-black font-bold text-lg">
              Monthly Report
            </Text>
            <Text className="font-global text-primary-text text-base">
              Last 6 months
            </Text>

            <View className="py-6">
              <BarChart
                //   yAxisLabelPrefix={'IDR '}
                //   yAxisLabelWidth={40}
                frontColor="#ffba33"
                initialSpacing={20}
                yAxisTextStyle={{color: 'black'}}
                xAxisLabelTextStyle={{color: 'black', textAlign: 'center'}}
                barWidth={22}
                noOfSections={3}
                barBorderRadius={4}
                data={monthlyReport}
                yAxisThickness={0}
                xAxisThickness={0}
                disableScroll
              />
            </View>
            <Divider my="1" backgroundColor="#D6D9DC" />
            <View className="flex-row items-center gap-x-4 my-2 px-2">
              <View className="flex-1 flex-row items-center">
                <View className="bg-secondary h-2 w-2 rounded-full mr-4" />
                <Text className="font-global text-primary-text text-sm">
                  Income
                </Text>
              </View>
              <View className="flex-1 flex-row items-center">
                <View className="bg-primary h-2 w-2 rounded-full mr-4" />
                <Text className="font-global text-primary-text text-sm">
                  Outcome
                </Text>
              </View>
            </View>
          </View>
        </Skeleton>
        <Skeleton
          h={96}
          startColor={'gray.300'}
          endColor={'gray.400'}
          isLoaded={!loadDa && !loadMr}
          marginY={8}
          rounded={'xl'}>
          <View className="bg-white rounded-xl p-3 my-8">
            <Text className="font-global text-black font-bold text-2xl">
              IDR {n_f(typeof dailyAvg === 'object' ? dailyAvg[6]?.value : 0)}
            </Text>
            <Text className="font-global text-primary-text text-base">
              Daily Average
            </Text>

            <View className="py-6">
              <BarChart
                //   yAxisLabelPrefix={'IDR '}
                yAxisLabelWidth={50}
                y
                initialSpacing={4}
                yAxisTextStyle={{color: 'black'}}
                xAxisLabelTextStyle={{
                  color: 'black',
                  textAlign: 'center',
                  fontWeight: 800,
                }}
                barWidth={22}
                spacing={16}
                noOfSections={3}
                barBorderRadius={4}
                frontColor="#ffba33"
                data={dailyAvg}
                yAxisThickness={0}
                xAxisThickness={0}
                disableScroll
              />
            </View>
          </View>
        </Skeleton>

        <Skeleton
          h={72}
          startColor={'gray.300'}
          endColor={'gray.400'}
          isLoaded={!loadMr && !loadDa}
          rounded={'xl'}
          marginBottom={8}>
          <View className="bg-white rounded-xl p-3 mb-8 items-center justify-center">
            <Text className="font-global text-black font-bold text-lg">
              Goals
            </Text>
            <Text className="font-global text-primary-text text-base text-center mb-6">
              Your goals is still on 70%. Keep up the good work!
            </Text>
            <Center>
              <PieChart
                donut
                innerRadius={80}
                data={pieData}
                centerLabelComponent={() => {
                  return (
                    <Text
                      className="font-global text-black font-bold"
                      style={{fontSize: 30}}>
                      70%
                    </Text>
                  );
                }}
              />
            </Center>
          </View>
        </Skeleton>
      </ScrollView>
    </View>
  );
};

export default AdminDashboard;
