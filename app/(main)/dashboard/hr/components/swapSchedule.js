import { CustomDropdown, ThemedText } from '@/components';
import ModalCenter from '@/components/modal/ModalCenter';
import Color from '@/constants/Color';
import { ROUTES } from '@/constants/Routes';
import { getSwapAbsenceRequest } from '@/services/masterService';
import LoadingManager from '@/utils/LoadingManager';
import { AntDesign, Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
   FlatList,
   StyleSheet,
   TouchableOpacity,
   View
} from 'react-native';

const optionStatus = [
   {
      name: 'Semua',
      value: ''
   },
   {
      name: 'Diajukan',
      value: 'Diajukan'
   },
   {
      name: 'Disetujui',
      value: 'Disetujui'
   }
]

const optionType = [
   {
      name: 'Semua',
      value: ''
   },
   {
      name: 'Shift',
      value: 'Shift'
   },
   {
      name: 'Host',
      value: 'Host'
   }
]

const SwapScheduleApproval = ({isActive}) => {
   const isFirstFocus = useRef(true);

   const [modalFilter, setModalFilter] = useState(false)
   const [listData, setListData] = useState([])
   const [refreshing, setRefreshing] = useState(false);
   const [filter, setFilter] = useState({
      status: '',
      swap_type: 'Shift'
   })

   const getData = async () => {
      LoadingManager.show();
      const payload = {
         swap_type: filter.swap_type
      }
      if (filter.status) {
         payload.status = filter.status
      }
      const res = await getSwapAbsenceRequest(payload)
      LoadingManager.hide();
      console.log('res', res);
      if (res.success) {
         setListData(res.data)
      }
      setRefreshing(false)
   }

   const onRefresh = () => {
      if (!isActive) return;

      setRefreshing(true);
      getData(true);
   };

   useFocusEffect(
      useCallback(() => {
         isFirstFocus.current = true;

         return () => {
            isFirstFocus.current = false;
         };
      }, [])
   );

   useEffect(() => {
      if (!isFirstFocus.current) return;
      if (isActive) {
         getData();
      }
   }, [filter]);

   return (
      <View style={{justifyContent: 'center', alignItems: 'center',}}>
         <View style={styles.viewFilter}>
            <ThemedText type='Medium' size='lg'>
               Tukar Jadwal
            </ThemedText>
            <TouchableOpacity
               activeOpacity={0.9}
               style={styles.btnFilter}
               onPress={() => setModalFilter(true)}
            >
               <Feather
                  name='filter'
                  size={20}
                  color={Color.GreyscaleBlue[400]}
               />
            </TouchableOpacity>
         </View>
         <FlatList
            data={listData}
            keyExtractor={(item, index) => item.id}
            style={{width: '94%', paddingTop: 20}}
            contentContainerStyle={{gap: 20, paddingBottom: 100}}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={({item, index}) => (
               <TouchableOpacity 
                  activeOpacity={0.9}
                  onPress={() => {
                     router.push({
                        pathname: ROUTES.DETAIL_SWAP_ABSENCE_REQUEST,
                        params: { id: item.id },
                     })
                  }}
                  style={styles.cardItem}>
                  <View style={styles.rowBetween}>
                     <ThemedText type='Bold' size='base'>
                        Diajukan pada
                     </ThemedText>
                     <ThemedText size='md' color={Color.Base.Black}>
                        {moment(item.created_at).format('DD MMMM YYYY')}
                     </ThemedText>
                  </View>
                  <View style={styles.rowBetween}>
                     <ThemedText type='Bold' size='base'>
                        Pengaju
                     </ThemedText>
                     <ThemedText size='md' color={Color.Base.Black}>
                        {`${item.requester.first_name}`} {`${item.requester.last_name ?? ''}`}
                     </ThemedText>
                  </View>
                  <View style={styles.rowBetween}>
                     <ThemedText type='Bold' size='base'>
                        Dari
                     </ThemedText>
                     {
                        item.from_shift ? (
                           <ThemedText size='md' color={Color.Base.Black}>
                              {item.from_shift.name}
                           </ThemedText>
                        ) : (
                           <View style={{gap: 10, flexDirection: 'row', alignItems: 'center'}}>
                              <ThemedText size='md' color={Color.Base.Black}>
                                 {item.from_attendance.date}
                              </ThemedText>
                              <ThemedText size='xs' color={Color.Base.Black}>
                                 {item.from_attendance.start_time} - {item.from_attendance.end_time}
                              </ThemedText>
                           </View>
                        )
                     }
                  </View>
                  <View style={styles.rowBetween}>
                     <ThemedText type='Bold' size='base'>
                        Ke
                     </ThemedText>
                     {
                        item.to_shift ? (
                           <ThemedText size='md' color={Color.Base.Black}>
                              {item.to_shift.name}
                           </ThemedText>
                        ) : (
                           <View style={{gap: 10, flexDirection: 'row', alignItems: 'center'}}>
                              <ThemedText size='md' color={Color.Base.Black}>
                                 {item.to_attendance.date}
                              </ThemedText>
                              <ThemedText size='xs' color={Color.Base.Black}>
                                 {item.to_attendance.start_time} - {item.to_attendance.end_time}
                              </ThemedText>
                           </View>
                        )
                     }
                  </View>
                  <View style={styles.rowBetween}>
                     <ThemedText type='Bold' size='base'>
                        Status
                     </ThemedText>
                     <View style={[styles.roundedStatus, {
                        backgroundColor: item.status === 'Diajukan' ? Color.GreyscaleBlue[50] : Color.Base.White,
                        borderColor: item.status === 'Ditolak' ? Color.Red[500] : item.status === 'Dietujui' ? Color.Green[100] : Color.GreyscaleBlue[300]
                     }]}>
                        <ThemedText size='md' type='Medium' color={item.status === 'Diajukan' ? Color.Purple[500] : item.status === 'Ditolak' ? Color.Red[500] : Color.Green[500]}>
                           {item.status}
                        </ThemedText>
                     </View>
                  </View>
               </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
               <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <ThemedText>
                     Tidak ada data permohonan tukar jadwal
                  </ThemedText>
               </View>
            )}
         />
         <ModalCenter
            visible={modalFilter}
            onClose={() => setModalFilter(false)}
         >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
               <ThemedText size="lg" type="Medium">
                  Atur Filter
               </ThemedText>
               <TouchableOpacity
                  activeOpacity={0.9}
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => setModalFilter(false)}
               >
                  <AntDesign
                     name='closecircle'
                     size={20}
                  />
               </TouchableOpacity>
            </View>
            <View style={{marginTop: 15}}>
               <ThemedText size='base' type='Bold'>
                  Status
               </ThemedText>
               <CustomDropdown
                  items={optionStatus}
                  value={filter.status}
                  onSelectItem={(item) => {
                     setFilter((prev) => ({...prev, status: item.value}))
                     setModalFilter(false)
                  }}
               />
            </View>
            <View style={{marginTop: 15}}>
               <ThemedText size='base' type='Bold'>
                  Tipe
               </ThemedText>
               <CustomDropdown
                  items={optionType}
                  value={filter.swap_type}
                  onSelectItem={(item) => {
                     setFilter((prev) => ({...prev, swap_type: item.value}))
                     setModalFilter(false)
                  }}
               />
            </View>
         </ModalCenter>
      </View>
   )
}

const styles = StyleSheet.create({
   viewFilter: {
      width: '100%',
      backgroundColor: Color.Base.White,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15
   },
   btnFilter: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
      borderRadius: 6,
      backgroundColor: Color.Base.White,
      borderWidth: 1,
      borderColor: Color.GreyscaleBlue[200]
   },
   roundedStatus: {
      flexDirection: 'row',
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: Color.GreyscaleBlue[300],
      backgroundColor: Color.GreyscaleBlue[50]
   },
   cardItem: {
      width: '100%',
      alignSelf: 'center', 
      backgroundColor: Color.Base.White,
      gap: 10,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12
   },
   rowBetween: {
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between'
   }
})

export default SwapScheduleApproval;