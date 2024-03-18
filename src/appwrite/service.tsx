import {ID, Account, Client, Databases} from 'appwrite';
import {Alert} from 'react-native';

const appwriteClient = new Client();

export const APPWRITE_ENDPOINT: string = 'https://cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID: string = '65f41d646859db5f39e1';

type CreateUserAccount = {
  email: string;
  password: string;
  name: string;
};
type LoginUserAccount = {
  email: string;
  password: string;
};

class AppwriteService {
  account;
  constructor() {
    appwriteClient
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID);

    this.account = new Account(appwriteClient);
  }

  //create a new record of user inside appwrite

  async createAccount({email, password, name}: CreateUserAccount) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name,
      );
      if (userAccount) {
        //TODO: create login feature
        return this.login({email, password});
      } else {
        return userAccount;
      }
    } catch (error) {
      Alert.alert('Error', error as any);
      console.log('Appwrite service :: createAccount() :: ' + error);
    }
  }

  async login({email, password}: LoginUserAccount) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      Alert.alert('Error', error as any);
      console.log('Appwrite service :: loginAccount() :: ' + error);
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log('Appwrite service :: getCurrentAccount() :: ' + error);
    }
  }

  async logout() {
    try {
      return await this.account.deleteSession('current');
    } catch (error) {
      console.log('Appwrite service :: getCurrentAccount() :: ' + error);
    }
  }
}

export default AppwriteService;
