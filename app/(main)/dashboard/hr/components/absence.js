import { CustomDropdown, ThemedText } from '@/components';
import ModalCenter from '@/components/modal/ModalCenter';
import Color from '@/constants/Color';
import { ROUTES } from '@/constants/Routes';
import { getAbsenceRequest } from '@/services/masterService';
import { getMonthDateRange } from '@/utils/helpher';
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
      name: 'Diajukan',
      value: 'Diajukan'
   },
   {
      name: 'Disetujui',
      value: 'Disetujui'
   }
]

const AbsenceApproval = ({isActive}) => {
   const isFirstFocus = useRef(true);

   const rangeDate = getMonthDateRange();
   const [listData, setListData] = useState([])
   const [showFilter, setShowFilter] = useState(false)
   const [refreshing, setRefreshing] = useState(false);
   const [filter, setFilter] = useState({
      page: 1,
      perPage: 10,
      status: '',
      start_date: rangeDate.startDate,
      end_data: rangeDate.endDate
   })
   //use this if range date is by year
   // moment().startOf('year').format('YYYY-MM-DD')
   // moment().endOf('year').format('YYYY-MM-DD')

   const getData = async () => {
      const payload = {...filter}
      // console.log('cek filter', payload);
      if (payload.status === '') {
         delete payload.status
      }
      LoadingManager.show();
      const res = await getAbsenceRequest(payload)
      LoadingManager.hide();
      // console.log('res data', res);
      if (res.success) {
         setListData(res.data)
      } else {
         setListData([])
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
               Absensi
            </ThemedText>
            <TouchableOpacity
               activeOpacity={0.9}
               style={styles.btnFilter}
               onPress={() => setShowFilter(true)}
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
            keyExtractor={(item, index) => `${index}`}
            style={{width: '94%', paddingTop: 20}}
            contentContainerStyle={{gap: 20, paddingBottom: 100}}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={({item, idnex}) => (
               <TouchableOpacity 
                  activeOpacity={0.9}
                  onPress={() => {
                     router.push({
                        pathname: ROUTES.DETAIL_ABSENCE_REQUEST,
                        params: { id: item.id },
                     })
                  }}
                  style={styles.cardItem}>
                  <View style={styles.rowBetween}>
                     <ThemedText type='Bold' size='base'>
                        Nama
                     </ThemedText>
                     <ThemedText size='md' color={Color.Base.Black}>
                        {item.employee.first_name} {item.employee.last_name}
                     </ThemedText>
                  </View>
                  <View style={styles.rowBetween}>
                     <ThemedText type='Bold' size='base'>
                        Tanggal Permohonan
                     </ThemedText>
                     <ThemedText size='md' color={Color.Base.Black}>
                        {moment(item.date).format('DD MMMM YYYY')}
                     </ThemedText>
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
                  <View style={styles.rowBetween}>
                     <ThemedText type='Bold' size='base'>
                        Tanggal Persetujuan
                     </ThemedText>
                     <ThemedText size='md' color={item.approved_at ? Color.Base.Black : Color.GreyscaleBlue[400]}>
                        {`${item.approved_at ? moment(item.approved_at).format('DD MMMM YYYY') : item.rejected_reason ? moment(item.updated_at).format('DD MMMM YYYY') : 'Belum Disetujui'}`}
                     </ThemedText>
                  </View>
               </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
               <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <ThemedText>
                     Tidak ada data permohonan absensi
                  </ThemedText>
               </View>
            )}
         />
         <ModalCenter
            visible={showFilter}
            onClose={() => setShowFilter(false)}
         >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
               <ThemedText size="lg" type="Medium">
                  Atur Filter
               </ThemedText>
               <TouchableOpacity
                  activeOpacity={0.9}
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => setShowFilter(false)}
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
                     // console.log('item selected', item);
                     setFilter((prev) => ({...prev, status: item.value}))
                     setShowFilter(false)
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

export default AbsenceApproval;