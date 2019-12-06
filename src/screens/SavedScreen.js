import React from 'react';

import { Text, View, StyleSheet, TouchableOpacity, FlatList, Dimensions, Alert, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { getAllData, removeData } from '../storage/StorageHelper'
import Icon from 'react-native-vector-icons/FontAwesome';

import { uncomma, comma } from '../tools/comma'

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class SavedScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listings: [],
            updated: false,
        }
        this._setListings();
    }

    render() {
        let listings;
        if (this.state.updated) {
            listings = this.state.listings;
        } else if (this.props.values.listings.length > 0) {
            listings = this.props.values.listings;
        } else {
            listings = this.state.listings;
        }

        return (
            <ScrollView style={styles.screen}>

                <View style={styles.top}>
                    <Text style={styles.pageTitle}>Saved Listings</Text>
                </View>

                <View style={styles.container}>
                    <FlatList
                        data={listings}
                        keyExtractor= { (item, index) => index.toString() }
                        renderItem={this._renderItem} />
                </View>

            </ScrollView>
        );
    }

    async _setListings() {
        let listings = await getAllData();
        await this.setState({
            listings: listings}, () => {
                console.log('loading list');
        });
    }

    _renderItem = ({item}) => (
        <ListingComponent
            title={item[0]}
            item={JSON.parse(item[1])} />
    );
}

class ListingComponent extends React.PureComponent {
    render() {
        return (
            <View style={[styles.box, styles.dropShadowDefault, {flexDirection:'row'}]}>

                <TouchableOpacity 
                    style={{width: '85%'}}
                    onPress={() => this.onListingClick(this.props.title)}>

                    <Text style={styles.title}>{this.props.title}</Text>
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
                        <Text style={styles.cell}>Mortgage term</Text>
                        <Text style={styles.cell}>{this.props.item.term} years</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.cell, {color: '#0959b0'}]}>{this.props.item.frequency} payment</Text>
                        <Text style={[styles.cell, {color: '#0959b0'}]}>$ {this.props.item.result}</Text>
                    </View>

                </TouchableOpacity>
                
                <TouchableOpacity
                    style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                    onPress={() => this.onDeleteClick(this.props.title)}>
                    <Icon name="minus-circle" size={25} color="gray" />
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
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK', 
                    onPress: () => this._deleteListing(title),
                },
            ],
        );
    }

    _deleteListing(title) {
        removeData(title).then(() => {
            this._setListings();
            this.setState({
                updated: true,
            });
        })
    }

    onListingClick(title) {
        console.log(title);
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#0959b0',
    },
    container: {
        backgroundColor: 'white',
        width: '100%',
        padding: 30,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        minHeight: HEIGHT - 150,
    },
    top: {
        height: 80,
        justifyContent: 'flex-end',
        flex: 1,
        paddingBottom: 15,
    },
    pageTitle: {
        color: 'white',
        fontSize: 20,
        paddingLeft: 30,
    },
    header: {
        fontSize: 18,
        color: '#3e68ab',
        marginBottom: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    box: {
        marginTop: 10,
        marginBottom: 10,
        width: '100%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 5,
        paddingLeft: 20,
        backgroundColor: 'white',
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
        shadowOffset: {height: 2, width: 0},
        //android 
        elevation: 2,
    }

});

const mapStateToProps = (state) => {
    const { values } = state
    return { values }
};
  
export default connect(mapStateToProps)(SavedScreen);