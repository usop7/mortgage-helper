import React from 'react';
import { Text, View, StyleSheet, FlatList, Dimensions, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import { uncomma, comma } from '../tools/comma'
import { Color } from '../components/Values'


const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class DetailScreen extends React.Component {

    render() {
        return (
            <View style={styles.screen}>
                <View style={styles.header}>
                    <View style={styles.headerItem}>
                        <Text style={{color: 'white', textAlign: 'center'}}>MORTGAGE{"\n"}AMOUNT</Text>
                        <Text style={styles.result}>$ {this.props.values.mortgageAmount}</Text>
                    </View>

                    <View style={styles.headerItem}>
                        <Text style={{color: 'white', textAlign: 'center'}}>{this.props.values.frequency.toUpperCase()}{"\n"}PAYMENT</Text>
                        <Text style={styles.result}>$ {this.props.values.result}</Text>
                    </View>

                    <View style={styles.headerItem}>
                        <Text style={{color: 'white', textAlign: 'center'}}>TIMES</Text>
                        <Text style={[styles.result, {marginTop: 0}]}>{this.props.values.n}</Text>
                        <Text style={{color: 'white', textAlign: 'center'}}>{this.props.values.term} YEARS</Text>
                    </View>
                </View>

                <View style={styles.container}>

                    <View style={styles.row}>
                        <Text style={[styles.cell, {width: 30, fontWeight: 'bold'}]}>#</Text>
                        <Text style={[styles.cell, {fontWeight: 'bold'}]}>Principal</Text>
                        <Text style={[styles.cell, {fontWeight: 'bold'}]}>Interest</Text>
                        <Text style={[styles.cell, {fontWeight: 'bold'}]}>Balance</Text>
                    </View>

                    <FlatList
                        data={this.props.values.details}
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