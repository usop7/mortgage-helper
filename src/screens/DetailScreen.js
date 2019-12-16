import React from 'react';
import { Text, View, StyleSheet, FlatList, Dimensions, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import { uncomma, comma } from '../tools/comma'
import { Color } from '../components/Values'

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const radio_props = [
    {label: 'Each payment', value: 0 },
    {label: 'Cumulative(yearly)', value: 1 }
  ];

class DetailScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            radio_value: 0,
            mortgageAmount: '',
            result: '',
            frequency: 'Monthly',
            n: 0, 
            term: 0,
            details: [],
            detailsYear: []
        }
    }

    componentDidMount() {
        // add listner
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
            this.setState({
                mortgageAmount: this.props.values.mortgageAmount,
                result: this.props.values.result,
                n: this.props.values.n,
                term: this.props.values.term,
                frequency: this.props.values.frequency,
                details: this.props.values.details,
                detailsYear: this.props.values.detailsYear,
            });
        });
    }

    render() {
        return (
            <View style={styles.screen}>
                <View style={styles.header}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerItem}>Mortgage Amount</Text>
                        <Text style={styles.headerItem}>$ {this.state.mortgageAmount}</Text>
                    </View>

                    <View style={styles.headerRow}>
                        <Text style={styles.headerItem}>
                        {this.state.frequency !== undefined ? this.state.frequency : ''}Payment</Text>
                        <Text style={styles.headerItem}>$ {this.state.result}</Text>
                    </View>

                    <View style={styles.headerRow}>
                        <Text style={styles.headerItem}>Number of Payments</Text>
                        <Text style={styles.headerItem}>{this.state.n} ({this.state.term} years)</Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <Text style={styles.titleText}>Amortization Schedule</Text>
                    <TouchableOpacity
                        onPress={() => Alert.alert('Amortization Schedule', 'Each mortgage payment consists of principal and interest which change over time. You mortgage balance decreases by the principal amount.')}>
                        <Icon name="question-circle" size={20} color={Color.yellow} style={{marginLeft: 10}} />
                    </TouchableOpacity>
                </View>

                <View style={styles.container}>

                    <View style={styles.radioBox}>
                        <RadioForm
                            radio_props={radio_props}
                            animation={false}
                            initial={0}
                            buttonColor={Color.primary}
                            buttonSize={10}
                            selectedButtonColor={Color.primary}
                            labelColor={Color.dark}
                            labelStyle={{marginRight: 20, fontFamily: 'Lato-Regular'}}
                            selectedLabelColor={Color.dark}
                            onPress={(value) => {this.setState({radio_value: value})}}
                            formHorizontal={true}  />
                    </View>

                    <View style={[styles.row, {backgroundColor: '#e3e3e3'}]}>
                        <Text style={[styles.cell, {width: 30}]}>#</Text>
                        <Text style={styles.cell}>Balance</Text>
                        <Text style={styles.cell}>Payment</Text>
                        <Text style={styles.cell}>Principal</Text>
                        <Text style={styles.cell}>Interest</Text>
                    </View>

                    <FlatList
                        data={this.state.radio_value === 0 ? this.state.details : this.state.detailsYear}
                        keyExtractor= { (item, index) => index.toString() }
                        renderItem={this._renderItem}
                    />

                </View>

          </View>
        );
    }
    _renderItem = ({item}) => (
        <RowComponent 
            no={item.No}
            payment={item.Payment}
            principal={item.Principal}
            interest={item.Interest}
            balance={item.Balance} />
    );
    

}

class RowComponent extends React.PureComponent {
    render() {
        return (
            <View style={styles.row}>
                <Text style={[styles.cell, {width: 30}]}>{this.props.no}</Text>
                <Text style={[styles.cell, {color: Color.dark}]}>{this.props.balance}</Text>
                <Text style={styles.cell}>{this.props.payment}</Text>
                <Text style={styles.cell}>{this.props.principal}</Text>
                <Text style={styles.cell}>{this.props.interest}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Color.primary,
    },
    header: {
        margin: 15,
        width: '95%',
        alignSelf: 'center',
        padding: 5,
        backgroundColor: Color.dark,
        paddingLeft: 15,
    },
    headerRow: {
        margin: 3,
        flexDirection: 'row',
    },
    headerItem: {
        width: WIDTH * 0.95 / 2,
        alignItems: 'center',
        color: 'white',
        fontFamily: 'Lato-Regular',
    },
    titleText: {
        paddingLeft: 15,
        fontSize: 15,
        color: 'white',
        fontFamily: 'Lato-Bold',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        width: '95%',
        alignSelf: 'center',
        padding: 5,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        minHeight: HEIGHT - 200,
    },
    radioBox: {
        alignSelf: 'center',
        margin: 5,
    },
    row: {
        flexDirection: 'row',
        paddingBottom: 5,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#e3e3e3',
    },
    cell: {
        width: (WIDTH * 0.9 - 30)/4,
        textAlign: 'center',
        fontFamily: 'Lato-Regular',
    },
    box: {
        marginTop: 10,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: '#f0b026',
        padding: 5,
        paddingLeft: 20,
        marginBottom: 20,
        borderRadius: 10,
    },
    resultRow: {
        flexDirection: 'row',
    },
    resultCell: {
        width: (WIDTH * 0.9) / 2,
    },
});

const mapStateToProps = (state) => {
    const { values } = state
    return { values }
};
  
export default connect(mapStateToProps)(DetailScreen);