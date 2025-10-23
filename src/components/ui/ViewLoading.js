/* eslint-disable global-require */
import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import LoadingManager from '../../utils/LoadingManager';

class ViewLoading extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         visible: false,
      };
      this.show = this.show.bind(this);
      this.hide = this.hide.bind(this);
   }

   componentDidMount() {
      LoadingManager.setInstance({ show: this.show, hide: this.hide });
   }

   show() {
      this.setState({ visible: true });
   }

   hide() {
      this.setState({ visible: false });
   }

   render() {
      const { visible } = this.state;
      return (
         <Modal
            transparent={true}
            animationType="none"
            visible={visible}
            onRequestClose={() => {}}
            statusBarTranslucent={true}
         >
            <View style={styles.page}>
               <View style={styles.loaderWrapper}>
                  <ActivityIndicator size="large" color="#EB2933" />
               </View>
            </View>
         </Modal>
      );
   }
}

export default ViewLoading;

const styles = StyleSheet.create({
   page: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
   },
   loaderWrapper: {
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 8,
   },
});
