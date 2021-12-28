import React from 'react';

import {
    ScrollView
} from 'react-native';

import { Message } from "../Message"
import { styles } from './styles';

export function MessageList(){
    return (
        <ScrollView style={styles.container}>
            <Message />
            <Message />
            <Message />
        </ScrollView>
    );
}