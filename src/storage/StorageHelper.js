import AsyncStorage from '@react-native-community/async-storage';

export const VERSION_STR = '@@VERSION';

export const getVersion = async () => {
    try {
        const currVersion = await AsyncStorage.getItem(VERSION_STR);
        if (currVersion !== null) {
            return parseInt(currVersion);
        } else {
            await AsyncStorage.setItem(VERSION_STR, '0');
            return 0;
        }
    } catch (error) {
        console.log(error);
    }
}

export const updateVersion = async () => {
    try {
        const currVersion = await AsyncStorage.getItem(VERSION_STR);
        const newVersion = await (currVersion === null ? 0 : parseInt(currVersion)) + 1;
        await AsyncStorage.setItem(VERSION_STR, newVersion.toString());
        return newVersion;
    } catch (e) {
        console.log(e);
    }
}

export const getAllData = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const titles = await keys.filter(e => e !== VERSION_STR);
        return await AsyncStorage.multiGet(titles);
    } catch(e) {
        console.log(e);
    }
};

export const storeData = async (title, item) => {
    try {
        await AsyncStorage.setItem(title, item);
        return await updateVersion();
    } catch (e) {
        console.log(e);
    }
};

export const removeData = async (title) => {
    try {
        await AsyncStorage.removeItem(title);
        return await updateVersion();
    } catch (e) {
        console.log(e);
    }
};