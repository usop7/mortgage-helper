import React from 'react';

import { Text, View, StyleSheet, TouchableOpacity, FlatList, Dimensions, Alert, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { getAllData, removeData } from '../storage/StorageHelper'
import Icon from 'react-native-vector-icons/FontAwesome';

import { uncomma, comma, title } from '../tools/comma'
import { Color } from '../components/Values'

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class SavedScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listings: [],
        }
    }

    componentDidMount() {

        // add listner
        this.props.navigation.addListener ('willFocus', () => {
            getAllData().then(data => {
                this.setState({
                    listings: data}, () => {
                        console.log('saved screen: component loading');
                });
            });
        });
    }

    render() {
        return (
            <View style={styles.screen}>
          
                <View style={styles.header}>
                    <Text style={{fontSize: 18, color: 'white'}}>SAVED</Text>
                </View>

                <View style={styles.container}>
                    <FlatList
                        data={this.state.listings}
                        keyExtractor= { (item, index) => index.toString() }
                        renderItem={this._renderItem} />
                </View>

            </View>
        );
    }

    _renderItem = ({item}) => (
        <ListingComponent
            navigation={this.props.navigation}
            title={item[0]}
            item={JSON.parse(item[1])}
            onDelete={this._deleteListing.bind(this)} />
    );

    _deleteListing(title) {
        removeData(title).then(() => {
            getAllData().then(data => {
                this.setState({
                    listings: data}, () => {
                        console.log('listing deleted');
                });
            });
        })
    }
}

class ListingComponent extends React.PureComponent {
    render() {
        return (
            <View style={[styles.listing, styles.dropShadowDefault, {flexDirection:'row'}]}>

                <TouchableOpacity 
                    style={{width: '85%'}}
                    onPress={() => { this.props.navigation.navigate('Calculator', {
                        title: this.props.title,
                        homePrice: this.props.item.homePrice,
                        downPayment: this.props.item.downPayment,
                        downRate: this.props.item.downRate,
                        term: this.props.item.term,
                        rate: this.props.item.rate,
                        frequency: this.props.item.frequency}) }} >

                    <Text style={styles.title}>{title(this.props.title)}</Text>
                    <Text style={[styles.line, {color: 'gray'}]}>Created on {this.props.item.created}</Text>

                    <View style={styles.row}>
                        <Text style={styles.cell}>Home Price</Text>
                        <Text style={styles.cell}>$ {comma(this.props.item.homePrice)}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.cell}>Down Payment</Text>
                        <Text style={styles.cell}>$ {comma(this.props.item.downPayment)}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.cell}>Interest Rate</Text>
                        <Text style={styles.cell}>{this.props.item.rate} %</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.cell}>Mortgage Term</Text>
                        <Text style={styles.cell}>{this.props.item.term} years</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.cell, {color: Color.highlight}]}>{this.props.item.frequency} Payment</Text>
                        <Text style={[styles.cell, {color: Color.highlight}]}>$ {this.props.item.result}</Text>
                    </View>

                </TouchableOpacity>
                
                <TouchableOpacity
                    style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                    onPress={() => this.onDeleteClick(this.props.title)}>
                    <Icon name="minus-circle" size={20} color="gray" />
                </TouchableOpacity>

            </View>
        )
    }

    onDeleteClick(title) {
        Alert.alert(
            'DELETE',
            'Delete this listing',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK', 
                    onPress: () => this.props.onDelete(title),
                },
            ],
        );
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
        flex: 1,
        backgroundColor: 'white',
        width: '95%',
        alignSelf: 'center',
        padding: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        minHeight: HEIGHT - 200,
    },
    title: {
        color: Color.dark,
        fontSize: 16,
    },
    listing: {
        marginTop: 10,
        marginBottom: 10,
        width: '95%',
        alignSelf: 'center',

        borderRadius: 10,
        borderBottomColor: Color.primary,
        borderBottomWidth: 3,
        padding: 10,
        paddingLeft: 20,
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: (WIDTH * 0.9) / 2 - 20,
    },
    deleteCell: {
        width: 25,
    },
    /* Drop Shadows */
    dropShadowDefault: {
        //ios
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: {height: 2, width: 2},
        //android 
        elevation: 2,
    }

});

const mapStateToProps = (state) => {
    const { values } = state
    return { values }
};
  
export default connect(mapStateToProps)(SavedScreen);