import React from 'react';
import { Text, View, StyleSheet, FlatList, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import { uncomma, comma } from '../tools/comma'
import { Color } from '../components/Values'
import { isTSConstructorType } from '@babel/types';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const radio_props = [
    {label: 'Each payment', value: 0 },
    {label: 'Yearly', value: 1 }
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
                    <View style={styles.headerItem}>
                        <Text style={{color: 'white', textAlign: 'center'}}>MORTGAGE{"\n"}AMOUNT</Text>
                        <Text style={styles.result}>$ {this.state.mortgageAmount}</Text>
                    </View>

                    <View style={styles.headerItem}>
                        <Text style={{color: 'white', textAlign: 'center'}}>
                        {this.state.frequency !== undefined ? this.state.frequency.toUpperCase() : ''}{"\n"}PAYMENT</Text>
                        <Text style={styles.result}>$ {this.state.result}</Text>
                    </View>

                    <View style={styles.headerItem}>
                        <Text style={{color: 'white', textAlign: 'center'}}>TIMES</Text>
                        <Text style={[styles.result, {marginTop: 0}]}>{this.state.n}</Text>
                        <Text style={{color: 'white', textAlign: 'center'}}>{this.state.term} YEARS</Text>
                    </View>
                </View>

            <View style={{alignItems: 'center'}}>
                <RadioForm
                    radio_props={radio_props}
                    animation={false}
                    initial={0}
                    buttonColor={'#ffffff'}
                    buttonSize={15}
                    selectedButtonColor={'#ffffff'}
                    labelColor={'#ffffff'}
                    labelStyle={{marginRight: 20, fontSize: 15}}
                    selectedLabelColor={'#ffffff'}
                    onPress={(value) => {this.setState({radio_value: value})}}
                    formHorizontal={true}  />
                </View>

                <View style={styles.container}>

                    <View style={styles.row}>
                        <Text style={[styles.cell, {width: 30, fontWeight: 'bold'}]}>#</Text>
                        <Text style={[styles.cell, {fontWeight: 'bold'}]}>Principal</Text>
                        <Text style={[styles.cell, {fontWeight: 'bold'}]}>Interest</Text>
                        <Text style={[styles.cell, {fontWeight: 'bold'}]}>Balance</Text>
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
                <Text style={styles.cell}>{this.props.principal}</Text>
                <Text style={styles.cell}>{this.props.interest}</Text>
                <Text style={[styles.cell, {color: Color.dark}]}>{this.props.balance}</Text>
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
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10,
        paddingLeft: 15,
        flexDirection: 'row',
    },
    headerItem: {
        width: (WIDTH - 30) / 3,
        alignItems: 'center',
    },
    result: {
        marginTop: 5,
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
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
    row: {
        flexDirection: 'row',
        paddingBottom: 5,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#e3e3e3',
    },
    cell: {
        width: (WIDTH * 0.9 - 30)/3,
        textAlign: 'center'
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