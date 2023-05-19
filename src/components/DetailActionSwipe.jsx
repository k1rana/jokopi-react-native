import DetailIcon from '../assets/icons/detail.svg';
import {TouchableOpacity, View} from '../utils/wrapper/nativewind';

const DetailActionSwipe = ({onDetail}) => {
  return (
    <View className=" pl-6 flex-row items-center justify-center">
      <TouchableOpacity
        className="bg-primary w-12 h-12 rounded-full items-center justify-center"
        onPress={onDetail}>
        <DetailIcon />
      </TouchableOpacity>
    </View>
  );
};

export default DetailActionSwipe;
