import React from 'react';
import { Text, View, StyleSheet, TextInput, Picker, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { calculateValues } from '../actions/CalculateAction';
import Icon from 'react-native-vector-icons/FontAwesome';
import DialogInput from 'react-native-dialog-input';

import { uncomma, comma } from '../tools/comma'
import { storeData, getAllData, getVersion } from '../storage/StorageHelper'
import { Color } from '../components/Values'

const HEIGHT = Dimensions.get('window').height;

class CalculatorScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,

            homePrice: '',
            downPayment: '',
            rate: 0,
            term: 0,
            frequency: 'Monthly',
            
            n: 0,
            result: '',
            mortgageAmount: '',
            totalInterest: '',
            totalPayment: '',
            details: [],

            storageVersion: '',
        }
    }

    componentDidMount() {
        getVersion().then(version => {
            this.setState({
                storageVersion: version}, () => {
                    this.props.calculateValues(this.state);
            });
        });   
    }

    render() {
      return (
          <ScrollView style={styles.screen}>
          
            <View style={styles.header}>
                <Text style={{fontSize: 18, color: 'white'}}>{this.state.frequency} Payment</Text>
                <Text style={styles.result}>$ {comma(this.state.result)}</Text>
            </View>

            <View style={styles.container}>

                <View style={styles.row}>
                    <Icon name="home" size={35} color={Color.primary} />
                    <TextInput 
                        style={styles.input}
                        onChangeText={text => {this._onInputChange(text, 'homePrice')}}
                        value={this.state.homePrice}
                        keyboardType={'numeric'}
                        placeholder="Home Price ($)"/>
                    <TouchableOpacity
                        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => Alert.alert('Home Price', 'The price of the home you may want to buy.')}>
                        <Icon name="question-circle" size={20} color={Color.yellow} />
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <Icon name="download" size={35} color={Color.primary} />
                    <TextInput 
                        style={styles.input} 
                        onChangeText={text => {this._onInputChange(text, 'downPayment')}}
                        value={this.state.downPayment}
                        keyboardType={'numeric'}
                        placeholder="Down Payment ($)"/>
                    <TouchableOpacity
                        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => Alert.alert('Home Price', 'The price of the home you may want to buy.')}>
                        <Icon name="question-circle" size={20} color={Color.yellow} />
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <Icon name="calendar" size={35} color={Color.primary} />
                    <TextInput 
                        style={styles.input}
                        onChangeText={text => {this._onInputChange(text, 'term')}}
                        keyboardType={'numeric'}
                        placeholder="Mortgage Years"/>
                    <TouchableOpacity
                        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => Alert.alert('Home Price', 'The price of the home you may want to buy.')}>
                        <Icon name="question-circle" size={20} color={Color.yellow} />
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <Icon name="percent" size={35} color={Color.primary} />
                    <TextInput 
                        style={styles.input}
                        onChangeText={text => {this._onInputChange(text, 'rate')}}
                        keyboardType={'numeric'}
                        placeholder="Interest Rate"/>
                    <TouchableOpacity
                        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => Alert.alert('Home Price', 'The price of the home you may want to buy.')}>
                        <Icon name="question-circle" size={20} color={Color.yellow} />
                    </TouchableOpacity>
                </View>

                <View style={[styles.row, {marginBottom: 25}]}>
                    <Icon name="clock-o" size={35} color={Color.primary} />
                    <Picker
                        selectedValue={this.state.frequency}
                        style={styles.picker}
                        onValueChange={(value, index) => {this._onInputChange(value, 'frequency')}} >
                        <Picker.Item label="Monthly" value="Monthly" />
                        <Picker.Item label="Bi-weekly" value="Bi-weekly" />
                        <Picker.Item label="Weekly" value="Weekly" />
                    </Picker>
                    <TouchableOpacity
                        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => Alert.alert('Home Price', 'The price of the home you may want to buy.')}>
                        <Icon name="question-circle" size={20} color={Color.yellow} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={ () => {this.showDialog(true)}}>
                        <Text style={{color: 'white'}}>SAVE</Text>
                </TouchableOpacity>

                <DialogInput 
                    isDialogVisible={this.state.dialogVisible}
                    title={"Save"}
                    message={"Enter a mortgage name"}
                    hintInput ={"430K Townhouse"}
                    submitInput={ (text) => this.submitDialog(text) }
                    closeDialog={ () => this.showDialog(false)}>
                </DialogInput>

            </View>
            </ScrollView>
      );
    }

    showDialog(visible) {
        const home = uncomma(this.state.homePrice);
        const down = uncomma(this.state.downPayment);
        const rate = this.state.rate;
        const year = this.state.term;
        let isValid = (home > 0 && rate >= 0 && year > 0);
        if (isValid) {
            this.setState({dialogVisible: visible});
        } else {
            Alert.alert('Check', 'Please fill in all the values first!')
        }
    }

    submitDialog(text) {

        // getting yyyy-mm-dd format of current date
        const d = new Date();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        const date = [year, month, day].join('-');

        let dict = {
            homePrice: this.state.homePrice,
            downPayment: this.state.downPayment,
            rate: this.state.rate,
            term: this.state.term,
            frequency: this.state.frequency,
            result: this.state.result,
            created: date
        }
        dict = JSON.stringify(dict);
        storeData(text, dict).then((newVersion) => {
            this.setState({storageVersion: newVersion}, () =>{
                this.props.calculateValues(this.state);
            });
        });
        this.showDialog(false);
    }

    _onInputChange = (text, type) => {
        let value = text;
        if (type === 'downPayment' || type === 'homePrice') {
            value = comma(uncomma(text))
        }
        this.setState({
            [type]: value
        },() => {
            this._calculateMortgage();
        });
    }

    _calculateMortgage = () => {

        // Variable Declaration
        const home = uncomma(this.state.homePrice);
        const down = uncomma(this.state.downPayment);
        const rate = this.state.rate;
        const year = this.state.term;
        const frequency = this.state.frequency;
        let isValid = (home > 0 && rate >= 0 && year > 0);

        var detailArray = [];
        const mortgage = Math.max(home - down, 0);

        let result = '', totalPayment = '', totalInterest = '', n = 0;
        if (isValid) {
            // Calculation
            let balance = mortgage;
            
            let divider = 1;
            if (frequency === "Monthly")
                divider = 12;
            else if (frequency === "Bi-weekly")
                divider = 26;
            else if (frequency === "Weekly")
                divider = 52;

            const i = rate/divider/100;
            const v = 1/(1+i);
            n = Math.trunc(year * divider);
            const formula = (1 - Math.pow(v, n)) / i;

            if (i === 0)
                result = mortgage / n;
            else
                result = mortgage / formula;

            totalPayment = result * n;
            totalInterest = totalPayment - mortgage;

            // Calculate details
            for (let t = 1; t <= n; t++)
            {
                let interest = balance * i;
                let principal = result - interest;
                balance = balance - principal;

                detailArray = detailArray.concat({
                                            No: t, 
                                            Principal: comma(Math.round(principal, 0)), 
                                            Interest: comma(Math.round(interest, 0)), 
                                            Balance: comma(Math.round(balance, 0))});
            }

        }

        // Update Results
        this.setState({
            n: n,
            result: comma(Math.round(result, 0)),
            mortgageAmount: comma(mortgage),
            totalInterest: comma(Math.round(totalInterest, 0)),
            totalPayment: comma(Math.round(totalPayment, 0)),
            details: detailArray
        }, () => {
            this.props.calculateValues(this.state);
        } );
    }

  }

  const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Color.primary,
    },
    header: {
        width: '100%',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10,
    },
    result: {
        fontSize: 40,
        color: 'white',
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: 10,
    },
    container: {
        backgroundColor: 'white',
        width: '95%',
        alignSelf: 'center',
        padding: 30,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        minHeight: HEIGHT - 200,
    },
    row: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#ededed',
        borderRadius: 30,
        width: '70%',
        height: 40,
        marginLeft: 20,
        paddingLeft: 20,
    },
    picker: {
        height: 40, 
        width: '70%',
        marginLeft: 20,
    },
    button: {
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: Color.dark, 
        height: 40,
        borderRadius: 30,
    }
});

const mapStateToProps = (state) => {
    const { values, listings } = state
    return { values, listings }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        calculateValues,
    }, dispatch)
  );

export default connect(mapStateToProps, mapDispatchToProps)(CalculatorScreen);