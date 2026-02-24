import { ThemedHeader, ThemedText } from '@/components';
import ModalCenter from '@/components/modal/ModalCenter';
import ModalRejectImage from '@/components/modal/ModalRejectImage';
import Color from '@/constants/Color';
import { PATH } from '@/constants/PathAsset';
import { actionAbsenceRequest, getDetailAbsenceRequest } from '@/services/masterService';
import { usePositionBottom } from '@/utils/bottomPosition';
import LoadingManager from '@/utils/LoadingManager';
import { ShowToastMessage } from '@/utils/toastMessage';
import { AntDesign } from '@expo/vector-icons';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import {
   Alert,
   Image,
   ScrollView,
   StyleSheet,
   TextInput,
   TouchableOpacity,
   View
} from 'react-native';

const DetailAbsence = () => {
   const { bottom } = usePositionBottom();
   const { id } = useLocalSearchParams();
   
   const [detail, setDetail] = useState({})
   const [modalReason, setModalReason] = useState(false)
   const [reason, setReason] = useState('')
   const [showModalImage, setShowModalImage] = useState(false)
   const [pathImage, setPathImage] = useState('')

   const getData = async () => {
      LoadingManager.show();
      const res = await getDetailAbsenceRequest(id);
      LoadingManager.hide();
      
      if (res.success) {
         let info = [
            {label: 'NRP', value: res.data.employee.nrp},
            {label: 'Nama', value: `${res.data.employee.first_name} ${res.data.employee.last_name ?? ''}`},
            {label: 'Tanggal Absensi', value: res.data.date},
            {label: 'Jenis Permohonan', value: res.data.type_request},
            {label: 'Status', value: res.data.status},
            {label: 'Alasan', value: res.data.reason},
         ]
         const data = {
            ...res.data,
            info
         }
         setDetail(data)
      }
   }

   const reject = async () => {
      setModalReason(false)
      LoadingManager.show();
      const res = await actionAbsenceRequest(id, 'reject', {rejected_reason: reason})
      LoadingManager.hide();
      if (res.success) {
         Alert.alert('Permohonan Ditolak', 'Permohonan ini telah ditolak')
         router.back();
      } else {
         ShowToastMessage(res.message)
      }
   }

   const approve = async () => {
      LoadingManager.show();
      const res = await actionAbsenceRequest(id, 'approve')
      LoadingManager.hide();
      if (res.success) {
         Alert.alert('Permohonan Disetujui', 'Permohonan ini telah disetujui')
         router.back();
      } else {
         ShowToastMessage(res.message)
      }
   }

   useEffect(() => {
      getData();
   },[])
   
   return (
      <View style={{flex: 1}}>
         <ThemedHeader
            title='Detail Permohonan'
         />
         <ScrollView 
            contentContainerStyle={{padding: 16}}
            showsVerticalScrollIndicator={false}>
            <View style={styles.borderCard}>
               <ThemedText size='lg' type='Bold'>
                  Detail Permohonan
               </ThemedText>
               <View style={{marginTop: 20, gap: 10}}>
                  {
                     detail?.info?.map((v, index) => (
                        <View 
                           key={`${index}`}
                           style={[styles.rowCenter, {
                              alignItems: v.label === 'Alasan' ? 'flex-start' : 'center'
                           }]}>
                           <View style={{width: '40%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                              <ThemedText size='base' type='Medium'>
                                 {v.label}
                              </ThemedText>
                              <ThemedText size='md' type='Medium'>
                                 :
                              </ThemedText>
                           </View>
                           <View style={{width: '60%', paddingLeft: 20}}>
                              <ThemedText size='md' type='Medium'>
                                 {v.value}
                              </ThemedText>
                           </View>
                        </View>
                     ))
                  }
               </View>
               {/* REJECTED REASON */}
               {
                  detail?.rejected_reason && (
                     <View style={{
                        borderRadius: 8,
                        padding: 16,
                        backgroundColor: Color['Red-Primary'],
                        marginTop: 20
                     }}>
                        <View style={{gap: 5}}>
                           <ThemedText size='base' type='Medium' color={Color.Base.White}>
                              Alasan Ditolak
                           </ThemedText>
                           <ThemedText size='base' color={Color.Base.White}>
                              {detail?.rejected_reason}
                           </ThemedText>
                        </View>
                     </View>
                  )
               }
               <View style={{
                  marginTop: 20,
                  paddingBottom: 12,
               }}>
                  <ThemedText>
                     Attachment
                  </ThemedText>
                  {
                     detail?.attachments?.length > 0 ? (
                        <View style={{
                           flexDirection: 'row', 
                           alignItems: 'center',
                           gap: 12,
                           marginTop: 15
                        }}>
                           {
                              detail?.attachments.map((v, index) => (
                                 <TouchableOpacity
                                    key={`${index}`}
                                    activeOpacity={0.9}
                                    style={{
                                       width: '30%',
                                    }}
                                    onPress={() => {
                                       setPathImage(`${PATH}${v}`)
                                       setTimeout(() => {
                                          setShowModalImage(true)
                                       }, 500);
                                    }}
                                 >
                                    <Image
                                       source={{uri: PATH+v}}
                                       style={{
                                          width: '100%',
                                          height: 100,
                                          borderRadius: 6,
                                          resizeMode: 'cover'
                                       }}
                                    />
                                 </TouchableOpacity>
                              ))
                           }
                        </View>
                     ) : (
                        <ThemedText>
                           Tidak ada attachment
                        </ThemedText>
                     )
                  }
               </View>
            </View>
         </ScrollView>
         {/* BUTTON VIEW */}
         {
            detail?.approved_at === null && detail?.rejected_reason === null && (
               <View style={[styles.footer, { bottom }]}>
                  <TouchableOpacity
                     activeOpacity={0.9}
                     style={styles.btn}
                     onPress={() => setModalReason(true)}
                  >
                     <ThemedText color={Color.Base.White} size='base'>
                        Tolak
                     </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                     activeOpacity={0.9}
                     style={[styles.btn, {
                        backgroundColor: Color.Green[500]
                     }]}
                     onPress={approve}
                  >
                     <ThemedText color={Color.Base.White} size='base'>
                        Setujui
                     </ThemedText>
                  </TouchableOpacity>
               </View>
            )
         }
         <ModalCenter
            visible={modalReason}
            onClose={() => setModalReason(false)}
         >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
               <ThemedText size="lg" type="Medium">
                  Masukkan Alasan
               </ThemedText>
               <TouchableOpacity
                  activeOpacity={0.9}
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => setModalReason(false)}
               >
                  <AntDesign
                     name='closecircle'
                     size={20}
                  />
               </TouchableOpacity>
            </View>
            <TextInput
               placeholder='Masukkan alasan'
               multiline
               value={reason}
               onChangeText={(text) => setReason(text)}
               style={styles.txtInput}
            />
            <TouchableOpacity
               activeOpacity={0.9}
               style={[styles.btnSubmit, {backgroundColor: reason === '' ? Color.GreyscaleBlue[300] : Color.Green[400]}]}
               onPress={reject}
               disabled={reason === ''}
            >
               <ThemedText color={Color.Base.White} type='Medium'>
                  Submit
               </ThemedText>
            </TouchableOpacity>
         </ModalCenter>
         <ModalRejectImage
            visible={showModalImage}
            onClose={() => setShowModalImage(false)}
            uri={pathImage}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   btnSubmit: {
      width: '90%',
      marginTop: 15,
      paddingVertical: 10,
      borderRadius: 6,
      backgroundColor: Color.Green[400],
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
   },
   txtInput: {
      borderRadius: 6,
      borderWidth: 1,
      borderColor: Color.GreyscaleBlue[200],
      height: 100,
      paddingHorizontal: 10,
      textAlignVertical: 'top',
      marginTop: 15
   },
   btn: {
      width: '45%',
      paddingVertical: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: Color.GreyscaleBlue[200],
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Color.Red[500]
   },
   footer: {
      position: "absolute",
      width: "100%",
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      backgroundColor: Color.Base.White,
      paddingVertical: 10,
   },
   rowCenter: {
      flexDirection: 'row',
      alignItems: 'center'
   },
   borderCard: {
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Color.GreyscaleBlue[200],
      backgroundColor: Color.Base.White
   },
})

export default DetailAbsence;