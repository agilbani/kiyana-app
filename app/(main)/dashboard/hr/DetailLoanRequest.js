import { ThemedHeader, ThemedText } from '@/components';
import ModalCenter from '@/components/modal/ModalCenter';
import ModalRejectImage from '@/components/modal/ModalRejectImage';
import Color from '@/constants/Color';
import { PATH } from '@/constants/PathAsset';
import { actionApproveLoanRequest, actionLoanRequest, getDetailLoanRequest } from '@/services/masterService';
import { usePositionBottom } from '@/utils/bottomPosition';
import LoadingManager from '@/utils/LoadingManager';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
   Alert,
   FlatList,
   Image,
   ScrollView,
   StyleSheet,
   TouchableOpacity,
   View
} from 'react-native';

const DetailLoanRequest = () => {
   const { bottom } = usePositionBottom();
   const { id } = useLocalSearchParams();
   const [detail, setDetail] = useState({})
   const [modalApprove, setModalApprove] = useState(false)
   const [showModalImage, setShowModalImage] = useState(false)
   const [pathImage, setPathImage] = useState('')
   console.log('detail', detail);
   
   const [attachment, setAttachment] = useState(null)

   const pickImage = async () => {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) return;

      const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         quality: 0.8,
      });

      if (!result.canceled) {
         setAttachment(result.assets[0]);
      }
   };

   const removeImage = () => {
      setAttachment(null);
   };

   const getData = async () => {
         LoadingManager.show();
         const res = await getDetailLoanRequest(id);
         LoadingManager.hide();
         console.log('detail absen', res);
         if (res.success) {
            let info = [
               {label: 'Status', value: res.data.status},
               {label: 'Persetujuan', value: res.data.approved_at ? moment(res.data.approved_at).format('DD MMMM YYYY') : 'Belum Disetujui'},
               {label: 'Nomor Pinjaman', value: res.data.number},
               {label: 'Tanggal Pengajuan', value: moment(res.data.submission_date).format('DD MMMM YYYY')},
               {label: 'Nominal', value: res.data.nominal},
               {label: 'Tenor', value: res.data.tenor},
               {label: 'Cicilan', value: res.data.installment_amount},
               {label: 'Sisa Cicilan', value: res.data.remaining_loan_amount},
               {label: 'Deskripsi Pinjaman', value: res.data.description},
            ]
            const data = {
               ...res.data,
               info
            }
            setDetail(data)
         }
      }
   
      const reject = async () => {
         LoadingManager.show();
         const res = await actionLoanRequest(id)
         LoadingManager.hide();
         if (res.success) {
            Alert.alert('Permohonan Ditolak', 'Permohonan ini telah dibatalkan');
            router.back();
         }
      }
   
      const approve = async () => {
         setModalApprove(false)
         console.log('cek attachment', attachment);
         
         const formatFile = {
            uri: attachment.uri,
            name: attachment.fileName,
            type: attachment.mimeType,
         }
         const formdata = new FormData()
         formdata.append('payment_proof', formatFile)
         LoadingManager.show();
         const res = await actionApproveLoanRequest(id, formdata)
         LoadingManager.hide();
         console.log('res approve', res);
         
         if (res.success) {
            Alert.alert('Permohonan Disetujui', 'Permohonan ini telah disetujui');
            router.back();
         }
      }
   
      useEffect(() => {
         getData();
      },[])

   return (
      <View style={{flex: 1}}>
         <ThemedHeader
            title='Detail Pinjaman'
         />
         <ScrollView 
            contentContainerStyle={{padding: 16}}
            showsVerticalScrollIndicator={false}>
            <View style={styles.borderCard}>
               <ThemedText size='lg' type='Bold'>
                  Detail Pinjaman
               </ThemedText>
               <View style={{marginTop: 20, gap: 10}}>
                  <FlatList
                     data={detail?.info ?? []}
                     keyExtractor={(item, index) => `${index}`}
                     numColumns={2}
                     contentContainerStyle={{gap: 15}}
                     columnWrapperStyle={{flexWrap: 'wrap'}}
                     scrollEnabled={false}
                     renderItem={({item}) => (
                        <View 
                           style={styles.rowCenter}>
                           <View style={{flexDirection: 'row'}}>
                              <ThemedText size='base' type='Medium' color={Color.GreyscaleBlue[400]}>
                                 {item.label}
                              </ThemedText>
                           </View>
                           <View>
                              <ThemedText size='md' type='Medium'>
                                 {item.value}
                              </ThemedText>
                           </View>
                        </View>
                     )}
                  />
               </View>
               {
                  detail?.payment_proof !== null && detail?.payment_proof !== "0" && (
                     <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity
                           activeOpacity={0.9}
                           style={{
                              borderWidth: 1,
                              borderRadius: 6,
                              paddingVertical: 4,
                              paddingHorizontal: 8,
                              borderColor: Color.GreyscaleBlue[200]
                           }}
                           onPress={() => {
                              setPathImage(`${PATH}${detail?.payment_proof}`)
                              setTimeout(() => {
                                 setShowModalImage(true)
                              }, 500);
                           }}
                        >
                           <ThemedText>
                              Bukti Pembayaran
                           </ThemedText>
                        </TouchableOpacity>
                     </View>
                  )
               }
            </View>
         </ScrollView>
         {
            detail?.status === 'Diajukan' && (
               <View style={[styles.footer, { bottom }]}>
                  <TouchableOpacity
                     activeOpacity={0.9}
                     style={styles.btn}
                     onPress={reject}
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
                     onPress={() => setModalApprove(true)}
                  >
                     <ThemedText color={Color.Base.White} size='base'>
                        Setujui
                     </ThemedText>
                  </TouchableOpacity>
               </View>
            )
         }
         <ModalCenter
            visible={modalApprove}
            onClose={() => setModalApprove(false)}
         >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
               <ThemedText size="lg" type="Medium">
                  Bukti Pembayaran
               </ThemedText>
               <TouchableOpacity
                  activeOpacity={0.9}
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => setModalApprove(false)}
               >
                  <AntDesign
                     name='closecircle'
                     size={20}
                  />
               </TouchableOpacity>
            </View>
            <TouchableOpacity
               activeOpacity={0.9}
               onPress={pickImage}
               style={styles.container}
               >
               {attachment ? (
                  <>
                     <Image
                        source={{ uri: attachment.uri }}
                        style={styles.image}
                     />

                     <TouchableOpacity
                        onPress={removeImage}
                        style={styles.removeBtn}
                        activeOpacity={0.8}
                     >
                        <Ionicons
                           name="close"
                           size={16}
                           color={Color.Base.White}
                        />
                     </TouchableOpacity>
                  </>
               ) : (
                  <Ionicons
                     name="image-outline"
                     size={32}
                     color={Color.Gray[400]}
                  />
               )}
               </TouchableOpacity>
            <TouchableOpacity
               activeOpacity={0.9}
               style={styles.btnSubmit}
               onPress={approve}
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
      // flexDirection: 'row',
      width: '50%',
      alignItems: 'flex-start',
      gap: 5,
      justifyContent: 'space-between'
   },
   borderCard: {
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Color.GreyscaleBlue[200],
      backgroundColor: Color.Base.White
   },
   container: {
      width: 120,
      height: 120,
      marginVertical: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: Color.Gray[300],
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Color.Gray[100],
   },
   image: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
   },
   removeBtn: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: Color.Red[500],
      justifyContent: 'center',
      alignItems: 'center',
   }
})

export default DetailLoanRequest;