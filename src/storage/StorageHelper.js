import AsyncStorage from '@react-native-community/async-storage';

export const _getData = async () => {
    let keys, values;
    try {
        keys = await AsyncStorage.getAllKeys();
        values = await AsyncStorage.multiGet(keys);
    } catch(e) {
        console.log(e);
    }
    return await values;
}

export const getAllData = async () => {
    let value = await _getData();
    return await value;
};

export const storeData = async (title, item) => {
    try {
        await AsyncStorage.setItem(title, item);
    } catch (e) {
        console.log(e);
    }
    return await true;
};

