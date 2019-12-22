import React from 'react';
import { Text, View, StyleSheet, TextInput, Picker, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { calculateValues } from '../actions/CalculateAction';
import Icon from 'react-native-vector-icons/FontAwesome';
import DialogInput from 'react-native-dialog-input';

import { uncomma, comma } from '../tools/comma'
import { storeData, getAllData } from '../storage/StorageHelper'
import { Color } from '../components/Values'

const HEIGHT = Dimensions.get('window').height;

class CalculatorScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            updated: false,

            homePrice: '300,000',
            downPayment: '60,000',
            downRate: '20',
            rate: '3.1',
            term: '25',
            frequency: 'Monthly',
            
            n: 0,
            result: '0',
            mortgageAmount: '',
            totalInterest: '',
            totalPayment: '',
            details: [],
            detailsYear: [],
        }
    }

    componentDidMount() {
        this._calculateMortgage();
        // add listner
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
            if (this.props.navigation.getParam('homePrice') != undefined && this.props.navigation.getParam('homePrice') !== '') {
                this.setState({
                    homePrice: this.props.navigation.getParam('homePrice', ''),
                    downPayment: this.props.navigation.getParam('downPayment', ''),
                    downRate: this.props.navigation.getParam('downRate', ''),
                    term: this.props.navigation.getParam('term', ''),
                    rate: this.props.navigation.getParam('rate', ''),
                    frequency: this.props.navigation.getParam('frequency', '')
                }, () => {
                    this._calculateMortgage();
                });
            }
            
        });

        this.willBlurSubscription = this.props.navigation.addListener('willBlur', () => {
            this.props.navigation.setParams({
                title: '',
                homePrice: '',
                downPayment: '',
                downRate: '',
                term: '',
                rate: '',
                frequency: '',
            });
        });

    }

    componentWillUnmount() {
        this.willFocusSubscription.remove();
        this.willBlurSubscription.remove();
    }

    render() {
      return (
          <ScrollView style={styles.screen}>
          
            <View style={styles.header}>
                <Text style={{fontSize: 18, color: 'white', fontFamily: 'Lato-Regular',}}>{this.state.frequency} Payment</Text>
                <Text style={styles.result}>$ {comma(this.state.result)}</Text>
            </View>

            <View style={styles.container}>

                <View style={styles.row}>
                    <Text style={styles.titleText}>Home Price</Text>
                </View>
                <View style={styles.marginBottomRow}>
                    <Icon name="home" size={35} color={Color.primary} />
                    <TextInput 
                        style={styles.input}
                        onChangeText={text => {this._onInputChange(text, 'homePrice')}}
                        value={this.state.homePrice}
                        keyboardType={'numeric'}
                        placeholder="300,000"/>
                    
                </View>

                <View style={styles.row}>
                    <Text style={styles.titleText}>Down Payment</Text>
                    <TouchableOpacity
                        onPress={() => Alert.alert('Down Payment', 'An initial amount of money that you pay up front when buying a home.')}>
                        <Icon name="question-circle" size={20} color={Color.yellow} style={{marginLeft: 10}} />
                    </TouchableOpacity>
                </View>
                <View style={styles.marginBottomRow}>
                    <Icon name="money" size={32} color={Color.primary} />
                    <TextInput 
                        style={[styles.input, {width: '46%'}]} 
                        onChangeText={text => {this._onInputChange(text, 'downPayment')}}
                        value={this.state.downPayment}
                        keyboardType={'numeric'}
                        placeholder="60,000"/>
                    <TextInput 
                        style={[styles.input, {width: 70, marginLeft: 10}]}
                        onChangeText={text => {this._onInputChange(text, 'downRate')}}
                        value={this.state.downRate}
                        keyboardType={'numeric'}
                        placeholder="20"/>
                    <Text style={{flex: 1, alignSelf: 'center', color: Color.dark}}> %</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.titleText}>Mortgage Years</Text>
                </View>
                <View style={styles.marginBottomRow}>
                    <Icon name="calendar" size={35} color={Color.primary} />
                    <TextInput 
                        style={styles.input}
                        onChangeText={text => {this._onInputChange(text, 'term')}}
                        keyboardType={'numeric'}
                        value={this.state.term}
                        placeholder="25"/>
                </View>

                <View style={styles.row}>
                    <Text style={styles.titleText}>Interest Rate</Text>
                    <TouchableOpacity
                        onPress={() => Alert.alert('Interest Rate', 'Interest rate varies from one bank to another, and based on your mortgage conditions.')}>
                        <Icon name="question-circle" size={20} color={Color.yellow}  style={{marginLeft: 10}}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.marginBottomRow}>
                    <Icon name="percent" size={35} color={Color.primary} />
                    <TextInput 
                        style={styles.input}
                        onChangeText={text => {this._onInputChange(text, 'rate')}}
                        value={this.state.rate}
                        keyboardType={'numeric'}
                        placeholder="3.1"/>
                </View>

                <View style={styles.row}>
                    <Text style={styles.titleText}>Payment Frequency</Text>
                </View>
                <View style={[styles.row, {marginBottom: 25}]}>
                    <Icon name="clock-o" size={35} color={Color.primary} />
                    <Picker
                        selectedValue={this.state.frequency}
                        style={styles.picker}
                        onValueChange={(value, index) => {this._onInputChange(value, 'frequency')}}
                        value={this.state.frequency} >
                        <Picker.Item label="Monthly" value="Monthly" />
                        <Picker.Item label="Bi-weekly" value="Bi-weekly" />
                        <Picker.Item label="Weekly" value="Weekly" />
                    </Picker>
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
                    hintInput ={"Burnaby 1 bed"}
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

        // check if the title is empty
        if (text.trim().length === 0) {
            Alert.alert('TITLE', 'Please enter the title.');
            return;
        }

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
            downRate: this.state.downRate,
            rate: this.state.rate,
            term: this.state.term,
            frequency: this.state.frequency,
            result: this.state.result,
            created: date
        }
        dict = JSON.stringify(dict);
        storeData(text, dict).then(() => {
            Alert.alert('Saved', 'The listing was saved.');
        });
        this.showDialog(false);
    }

    _onInputChange = (text, type) => {
        let homePrice = parseFloat(uncomma(this.state.homePrice));
        let value = text;
        if (type === 'downPayment') {      
            if (homePrice > 0) {
                if (parseFloat(uncomma(text)) > homePrice) {
                    Alert.alert('Check', 'Down payment can\'t be greater than the home price.');
                    value = '';
                    return;
                }
                const downRate = uncomma(text) / homePrice * 100;
                this.setState({
                    downRate: downRate.toFixed(1).toString()
                })
            }
            value = comma(uncomma(text));
        } else if (type === 'downRate') {
            if (homePrice > 0) {
                const downPayment = Math.round(homePrice * text / 100);
                this.setState({
                    downPayment: comma(downPayment)
                })
            }
        } else if (type === 'homePrice') {
            homePrice = uncomma(text);
            if (this.state.downRate > 0) {
                const downPayment = Math.round(homePrice * this.state.downRate / 100);
                this.setState({
                    downPayment: comma(downPayment)
                })
            }
            value = comma(uncomma(text));
        }

        this.setState({
            [type]: value
        },() => {
            this._calculateMortgage();
        });
    }

    _calculateMortgage = () => {

        // Variable Declaration
        const home = this.state.homePrice === '' ? 0 : parseFloat(uncomma(this.state.homePrice));
        const down = this.state.downPayment === '' ? 0 : parseFloat(uncomma(this.state.downPayment));
        const rate = (this.state.rate === '') ? 0 : this.state.rate;
        const year = this.state.term;
        const frequency = this.state.frequency;
        let isValid = (home > 0 && rate >= 0 && year > 0);

        var detailArray = [];
        var detailArrayYear = [];
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
            let interest, principal, yearInterest = 0, yearPrincipal = 0;
            for (let t = 1; t <= n; t++)
            {
                interest = balance * i;
                yearInterest += interest;
                principal = result - interest;
                yearPrincipal += principal;
                balance = balance - principal;

                detailArray = detailArray.concat({
                                            No: t, 
                                            Payment: comma(Math.round(result, 0)),
                                            Principal: comma(Math.round(principal, 0)), 
                                            Interest: comma(Math.round(interest, 0)), 
                                            Balance: comma(Math.round(balance, 0))});

                if (t % divider === 0) {
                    detailArrayYear = detailArrayYear.concat({
                        No: t / divider,
                        Payment: comma(Math.round(result * t, 0)),
                        Principal: comma(Math.round(yearPrincipal, 0)), 
                        Interest: comma(Math.round(yearInterest, 0)), 
                        Balance: comma(Math.round(balance, 0))});
                }
                
            }

        }

        // Update Results
        this.setState({
            n: n,
            result: comma(Math.round(result, 0)),
            mortgageAmount: comma(mortgage),
            totalInterest: comma(Math.round(totalInterest, 0)),
            totalPayment: comma(Math.round(totalPayment, 0)),
            details: detailArray,
            detailsYear: detailArrayYear,
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
        fontFamily: 'Lato-Regular',
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
        minHeight: HEIGHT - 195,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    marginBottomRow: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#ededed',
        borderRadius: 30,
        width: '80%',
        height: 40,
        marginLeft: 20,
        paddingLeft: 20,
        paddingTop: 10,
    },
    titleText: {
        fontFamily: 'Lato-Regular',
        color: Color.dark,
        fontSize: 16,
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