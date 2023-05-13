import React, {useMemo, useState} from 'react';

import _ from 'lodash';
import DatePicker from 'react-native-date-picker';
import {useDispatch, useSelector} from 'react-redux';

import {useNavigation} from '@react-navigation/native';

import BackIcon from '../../assets/icons/arrow-left-black.svg';
import CalendarIcon from '../../assets/icons/calendar.svg';
import {profileAction} from '../../store/slices/profile.slice';
import {editProfile} from '../../utils/https/auth';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '../../utils/wrapper/nativewind';

const Profile = () => {
  const nav = useNavigation();
  const auth = useSelector(state => state.auth);
  const profile = useSelector(state => state.profile);
  const controller = useMemo(() => new AbortController(), []);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    display_name:
      profile.data.display_name || _.split(profile.data?.email, '@')[0],
    email: profile.data.email,
    phone_number: profile.data.phone_number,
    address: profile.data.address || '',
    birthdate: new Date(profile.data.birthdate || 0),
    gender: '1',
  });

  const saveHandler = () => {
    editProfile(form, auth.data.token, controller)
      .then(result => {
        dispatch(
          profileAction.getProfileThunk({token: auth.data.token, controller}),
        );
        console.log('success');
      })
      .catch(err => {
        console.log('log error dibawah v');
        console.log(err);
      });
  };

  const genders = [
    {name: 'Male', id: '1'},
    {name: 'Female', id: '2'},
  ];
  return (
    <View className="flex-1 bg-#F5F5F8">
      <View className="px-10 py-6 flex-row justify-between items-center">
        <Pressable onPress={() => nav.goBack()}>
          <BackIcon />
        </Pressable>
        <Text className="font-global text-black text-base font-bold">
          Edit Profile
        </Text>

        <Text></Text>
      </View>
      <ScrollView>
        <View className="items-center mt-5">
          <Image
            source={
              profile.data.img
                ? {uri: profile.data.img}
                : require('../../assets/images/profile-img-placeholder.png')
            }
            className="w-[100] h-[100] aspect-square rounded-full bg-white mx-auto"
            style={{resizeMode: 'cover'}}
          />
        </View>
        <View className="px-8 mt-8">
          <Text className="font-global text-[#9F9F9F] font-bold text-base">
            Name :
          </Text>

          <TextInput
            placeholderTextColor={'#9A9A9D'}
            className="font-global text-black text-base border-b border-[#9F9F9F] py-1 mt-2"
            placeholder="Name"
            value={form.display_name}
            onChange={e => setForm({...form, display_name: e.nativeEvent.text})}
          />

          <View className="flex-row">
            {genders.map((item, idx) => (
              <View key={item.name}>
                <Pressable
                  className="flex-row py-3 items-center"
                  onPress={() => setForm({...form, gender: item.id})}>
                  <View
                    style={[
                      {
                        height: 24,
                        width: 24,
                        borderRadius: 12,
                        borderWidth: 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    ]}
                    className="border-primary">
                    {form.gender === item.id && (
                      <View
                        style={{
                          height: 12,
                          width: 12,
                          borderRadius: 6,
                        }}
                        className="bg-primary"
                      />
                    )}
                  </View>
                  <Text className="font-global text-black text-base ml-3 mr-6">
                    {item.name}
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>

          <Text className="font-global text-[#9F9F9F] font-bold text-base mt-2">
            Email address :
          </Text>

          <TextInput
            placeholderTextColor={'#9A9A9D'}
            className="font-global text-black text-base border-b border-[#9F9F9F] py-1 mt-2"
            placeholder="Name"
            value={form.email}
            onChange={e => setForm({...form, email: e.nativeEvent.text})}
          />

          <Text className="font-global text-[#9F9F9F] font-bold text-base mt-5">
            Phone number :
          </Text>

          <TextInput
            placeholderTextColor={'#9A9A9D'}
            className="font-global text-black text-base border-b border-[#9F9F9F] py-1 mt-2"
            placeholder="Name"
            value={form.phone_number}
            onChange={e => setForm({...form, phone_number: e.nativeEvent.text})}
          />

          <Text className="font-global text-[#9F9F9F] font-bold text-base mt-5">
            Date of Birth :
          </Text>
          <View className="relative">
            <TextInput
              editable={false}
              selectTextOnFocus={false}
              placeholderTextColor={'#9A9A9D'}
              className="font-global text-black text-base border-b border-[#9F9F9F] py-1 mt-2"
              placeholder="Name"
              value={form.birthdate.toISOString().substring(0, 10)}
            />
            <Pressable
              className="absolute right-0 bottom-0 top-4"
              onPress={() => setOpen(true)}>
              <CalendarIcon />
            </Pressable>
          </View>
          <DatePicker
            modal
            open={open}
            date={form.birthdate}
            mode="date"
            androidVariant="nativeAndroid"
            onConfirm={date => {
              setOpen(false);
              // console.log(date);
              setForm({...form, birthdate: date});
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
          <Text className="font-global text-[#9F9F9F] font-bold text-base mt-5">
            Delivery address :
          </Text>

          <TextInput
            placeholderTextColor={'#9A9A9D'}
            className="font-global text-black text-base border-b border-[#9F9F9F] py-1 mt-2"
            placeholder=""
            value={form.address}
            onChange={e => setForm({...form, address: e.nativeEvent.text})}
          />
        </View>

        <View className="px-8 mb-5">
          <TouchableOpacity
            className={` bg-[#6A4029] py-5 rounded-2xl w-full flex-row justify-center mt-6`}
            onPress={saveHandler}>
            <Text
              className={`font-global text-center text-white text-base font-bold `}>
              Save and update
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
