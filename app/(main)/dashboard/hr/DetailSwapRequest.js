import { ThemedHeader, ThemedText } from '@/components';
import ModalCenter from '@/components/modal/ModalCenter';
import Color from '@/constants/Color';
import { actionSwapAbsenceRequest, getDetailSwapAbsenceRequest } from '@/services/masterService';
import { usePositionBottom } from '@/utils/bottomPosition';
import LoadingManager from '@/utils/LoadingManager';
import { ShowToastMessage } from '@/utils/toastMessage';
import { AntDesign } from '@expo/vector-icons';
import { router, useLocalSearchParams } from "expo-router";
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
   Alert,
   ScrollView,
   StyleSheet,
   TextInput,
   TouchableOpacity,
   View
} from 'react-native';

const DetailSwapRequest = () => {
   const { bottom } = usePositionBottom();
   const { id } = useLocalSearchParams();

   const [modalReason, setModalReason] = useState(false)
   const [reason, setReason] = useState('')
   const [detail, setDetail] = useState({})

   const reject = async () => {
      setModalReason(false)
      LoadingManager.show();
      const res = await actionSwapAbsenceRequest(id, 'reject', {rejected_reason: reason})
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
      const res = await actionSwapAbsenceRequest(id, 'approve')
      LoadingManager.hide();
      if (res.success) {
         Alert.alert('Permohonan Ditolak', 'Permohonan ini telah ditolak')
         router.back();
      } else {
         ShowToastMessage(res.message)
      }
   }

   const getDetail = async () => {
      LoadingManager.show();
      const res = await getDetailSwapAbsenceRequest(id)
      LoadingManager.hide();
      // console.log('detail swap request', res);
      if (res.success) {
         setDetail(res.data)
      }
   }

   useEffect(() => {
      getDetail();
   },[])

   return (
      <View style={{flex: 1, backgroundColor: Color.Base.White}}>
         <ThemedHeader
            title='Detail Request Tukar Jadwal'
         />
         <ScrollView 
            style={{padding: 16}}
            contentContainerStyle={{paddingBottom: 250}}
            showsVerticalScrollIndicator={false}>
            <View style={{
               width: '100%',
               borderRadius: 8,
               padding: 16,
               backgroundColor: Color.GreyscaleBlue[50],
               gap: 15
            }}>
               <View style={{gap: 5}}>
                  <ThemedText size='base' type='Medium' color={Color.GreyscaleBlue[400]}>
                     Pengaju
                  </ThemedText>
                  <ThemedText size='base'>
                     {`${detail?.requester?.first_name}`} {`${detail?.requester?.last_name ?? ''}`}
                  </ThemedText>
               </View>
               <View style={{gap: 5}}>
                  <ThemedText size='base' type='Medium' color={Color.GreyscaleBlue[400]}>
                     Tanggal Pengajuan
                  </ThemedText>
                  <ThemedText size='base'>
                     {moment(detail?.created_at).format('DD MMMM YYYY')}
                  </ThemedText>
               </View>
               <View style={{gap: 5}}>
                  <ThemedText size='base' type='Medium' color={Color.GreyscaleBlue[400]}>
                     Status
                  </ThemedText>
                  <View style={{
                     flexDirection: 'row',
                     alignItems: 'center',
                  }}>
                     <View style={{
                        borderRadius: 6,
                        paddingVertical: 4,
                        paddingHorizontal: 8,
                        backgroundColor: Color.Yellow[200]
                     }}>
                        <ThemedText size='base'>
                           {detail?.status}
                        </ThemedText>
                     </View>
                  </View>
               </View>
               <View style={{gap: 5}}>
                  <ThemedText size='base' type='Medium' color={Color.GreyscaleBlue[400]}>
                     Tipe Pengajuan
                  </ThemedText>
                  <ThemedText size='base'>
                     {detail?.swap_type === "Shift" ? 'Shift' : 'Host Attendance'}
                  </ThemedText>
               </View>
            </View>
            <ThemedText size='lg' type='Medium' style={{marginTop: 20}}>
               Detail Tukar {`${detail?.swap_type === 'Shift' ? 'Jadwal' : 'Attendance Host'}`}
            </ThemedText>
            <View style={{
               marginTop: 20,
               borderRadius: 8,
               borderWidth: 1,
               borderColor: Color.GreyscaleBlue[200],
               padding: 16
            }}>
               <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  {/* LEFT CONTENT */}
                  <View style={{width: '49%', gap: 15}}>
                     <ThemedText size='lg'>
                        Dari
                     </ThemedText>
                     {
                        detail?.swap_type === 'Shift' ? (
                           <>
                              <View style={{gap: 5}}>
                                 <ThemedText size='xs' color={Color.GreyscaleBlue[300]}>
                                    Nama Shift: 
                                 </ThemedText>
                                 <ThemedText size='base'>
                                    {detail?.from_shift?.name}
                                 </ThemedText>
                              </View>
                              <View style={{gap: 5}}>
                                 <ThemedText size='xs' color={Color.GreyscaleBlue[300]}>
                                    Waktu: 
                                 </ThemedText>
                                 <ThemedText size='base'>
                                    {detail?.from_shift?.start_time} - {detail?.from_shift?.end_time}
                                 </ThemedText>
                              </View>
                           </>
                        ) : (
                           <>
                              <View style={{gap: 5}}>
                                 <ThemedText size='xs' color={Color.GreyscaleBlue[300]}>
                                    Tanggal: 
                                 </ThemedText>
                                 <ThemedText size='base'>
                                    {moment(detail?.from_attendance?.date).format('DD MMMM YYYY')}
                                 </ThemedText>
                              </View>
                              <View style={{gap: 5}}>
                                 <ThemedText size='xs' color={Color.GreyscaleBlue[300]}>
                                    Waktu: 
                                 </ThemedText>
                                 <ThemedText size='base'>
                                    {detail?.from_attendance?.start_time} - {detail?.from_attendance?.end_time}
                                 </ThemedText>
                              </View>
                              <View style={{gap: 5}}>
                                 <ThemedText size='xs' color={Color.GreyscaleBlue[300]}>
                                    Employee: 
                                 </ThemedText>
                                 <ThemedText size='base'>
                                    {`${detail?.from_attendance?.employee?.first_name} ${detail?.from_attendance?.employee?.last_name ?? ''}`} ({detail?.from_attendance?.employee?.nrp})
                                 </ThemedText>
                              </View>
                           </>
                        )
                     }
                  </View>
                  {/* RIGHT CONTENT */}
                  <View style={{width: '49%', gap: 15}}>
                     <ThemedText size='lg'>
                        Ke
                     </ThemedText>
                     {
                        detail?.swap_type === 'Shift' ? (
                           <>
                              <View style={{gap: 5}}>
                                 <ThemedText size='xs' color={Color.GreyscaleBlue[300]}>
                                    Nama Shift: 
                                 </ThemedText>
                                 <ThemedText size='base'>
                                    {detail?.to_shift?.name}
                                 </ThemedText>
                              </View>
                              <View style={{gap: 5}}>
                                 <ThemedText size='xs' color={Color.GreyscaleBlue[300]}>
                                    Waktu: 
                                 </ThemedText>
                                 <ThemedText size='base'>
                                    {detail?.to_shift?.start_time} - {detail?.to_shift?.end_time}
                                 </ThemedText>
                              </View>
                           </>
                        ) : (
                           <>
                              <View style={{gap: 5}}>
                                 <ThemedText size='xs' color={Color.GreyscaleBlue[300]}>
                                    Tanggal: 
                                 </ThemedText>
                                 <ThemedText size='base'>
                                    {moment(detail?.to_attendance?.date).format('DD MMMM YYYY')}
                                 </ThemedText>
                              </View>
                              <View style={{gap: 5}}>
                                 <ThemedText size='xs' color={Color.GreyscaleBlue[300]}>
                                    Waktu: 
                                 </ThemedText>
                                 <ThemedText size='base'>
                                    {detail?.to_attendance?.start_time} - {detail?.to_attendance?.end_time}
                                 </ThemedText>
                              </View>
                              <View style={{gap: 5}}>
                                 <ThemedText size='xs' color={Color.GreyscaleBlue[300]}>
                                    Employee: 
                                 </ThemedText>
                                 <ThemedText size='base'>
                                    {`${detail?.to_attendance?.employee?.first_name} ${detail?.to_attendance?.employee?.last_name ?? ''}`} ({detail?.to_attendance?.employee?.nrp})
                                 </ThemedText>
                              </View>
                           </>
                        )
                     }
                  </View>
               </View>
            </View>
            {/* REASON REQUEST */}
            <View style={{
               borderRadius: 8,
               padding: 16,
               backgroundColor: Color.Purple[200],
               marginTop: 20
            }}>
               <View style={{gap: 5}}>
                  <ThemedText size='base' type='Medium' color={Color.GreyscaleBlue[500]}>
                     Alasan Pengajuan
                  </ThemedText>
                  <ThemedText size='base'>
                     {detail?.reason}
                  </ThemedText>
               </View>
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
            {/* APPROVAL INFO */}
            <View style={{
               borderRadius: 8,
               padding: 16,
               backgroundColor: Color.GreyscaleBlue[50],
               marginTop: 20,
               gap: 15
            }}>
               <ThemedText size='base' type='Medium' color={Color.GreyscaleBlue[500]}>
                  Informasi Persetujuan
               </ThemedText>
               <View style={{gap: 5}}>
                  <ThemedText size='md' type='Medium' color={Color.GreyscaleBlue[500]}>
                     Disetujui Oleh
                  </ThemedText>
                  <ThemedText size='md'>
                     {detail?.approver ? detail?.approver?.name : '-'}
                  </ThemedText>
               </View>
               <View style={{gap: 5}}>
                  <ThemedText size='md' type='Medium' color={Color.GreyscaleBlue[500]}>
                     Tanggal Persetujuan
                  </ThemedText>
                  <ThemedText size='md'>
                     {moment(detail?.approved_at).format('DD MMMM YYYY')}
                  </ThemedText>
               </View>
            </View>
         </ScrollView>
         {
            detail?.approved_at === null && detail?.rejected_reason === null && (
               <View style={[styles.footer, {bottom}]}>
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
})

export default DetailSwapRequest;