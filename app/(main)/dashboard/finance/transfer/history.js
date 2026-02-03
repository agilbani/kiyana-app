import {
   ThemedBadge,
   ThemedGap,
   ThemedHeader,
   ThemedLoader,
   ThemedText
} from "@/components/ui";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { getHistoryTransfer } from "@/services/masterService";
import GlobalStyles from "@/styles/common";
import { formatRupiahDisplay } from "@/utils/currency";
import { getDateRange } from "@/utils/helpher";
import { scale, verticalScale } from "@/utils/scaleSize";
import moment from "moment";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const optionType = [
   { name: "Hari Ini", value: "today" },
   { name: "7 hari", value: "weekly" },
   { name: "14 hari", value: "biweekly" },
   { name: "21 hari", value: "threeweeks" },
   { name: "30 hari", value: "month" },
];

const History = () => {
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [filter, setFilter] = useState("today");

  const getData = async () => {
   console.log('asd');
   setLoading(true);
   const { startDate, endDate } = getDateRange(filter);
   const params = {
      start_date: startDate,
      end_date: endDate
   }
   console.log('asd params', params);
   const res = await getHistoryTransfer(params);
   setLoading(false);
   console.log('res history', res);
   if (res.success) {
      setListData(res?.data?.data || []);
   }
  };

  useEffect(() => {
    getData();
  }, [filter]);

  return (
    <View style={styles.card}>
      <StatusBar translucent barStyle="light-content" />
      <ThemedHeader title="History Transfer" />

      {/* HEADER INFO */}
      <View
        style={[
          GlobalStyles.rowSpaceBetween,
          { paddingHorizontal: 15, paddingTop: 15 },
        ]}
      >
        <View>
          <ThemedText type="SemiBold">Riwayat Transaksi</ThemedText>
          <ThemedGap height="xxs" />
          <ThemedText size="sm" color={Color.Text.Secondary}>
            {listData.length > 0
              ? `${listData.length} transaksi terbaru`
              : "Belum ada transaksi terbaru"}
          </ThemedText>
        </View>
      </View>

      {/* FILTER FLATLIST */}
      <View style={{height: 50}}>
         <FlatList
         data={optionType}
         horizontal
         showsHorizontalScrollIndicator={false}
         keyExtractor={(item) => item.value}
         style={{ marginTop: 12 }}
         contentContainerStyle={{
            paddingHorizontal: 15,
            gap: 10,
         }}
         renderItem={({ item }) => {
            const isActive = item.value === filter;

            return (
               <TouchableOpacity
               activeOpacity={0.8}
               onPress={() => setFilter(item.value)}
               style={[
                  styles.itemFilter,
                  isActive && {
                     borderColor: Color.Red[500],
                     backgroundColor: Color.Red[50],
                  },
               ]}
               >
               <ThemedText
                  size="sm"
                  type="Medium"
                  color={isActive ? Color.Red[500] : Color.Text.Primary}
               >
                  {item.name}
               </ThemedText>
               </TouchableOpacity>
            );
         }}
         />
      </View>

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 100 }}
      >
        {loading ? (
          <ThemedLoader />
        ) : (
          <>
            {
               listData.length > 0 ? listData.map((v, index) => (
                  <TouchableOpacity 
                     key={`${index}`}
                     activeOpacity={0.9}
                     style={[styles.taskWrapper, { marginTop: 15, gap: 4 }]}>
                     <View style={GlobalStyles.rowSpaceBetween}>
                        <ThemedText type="Medium">Jumlah Transfer</ThemedText>
                        <ThemedText type="SemiBold">
                           {formatRupiahDisplay(v.amount)}
                        </ThemedText>
                     </View>
                     {
                        v.type === 'out' ? (
                           <View style={GlobalStyles.rowSpaceBetween}>
                              <ThemedText type="Medium">Penerima</ThemedText>
                              <ThemedText type="SemiBold">
                                 {v.receiver}
                              </ThemedText>
                           </View>
                        ) : (
                           <View style={GlobalStyles.rowSpaceBetween}>
                              <ThemedText type="Medium">Pengirim</ThemedText>
                              <ThemedText type="SemiBold">
                                 {v.sender}
                              </ThemedText>
                           </View>
                        )
                     }

                     <View style={GlobalStyles.rowSpaceBetween}>
                        <ThemedText type="Medium">Status</ThemedText>
                        <ThemedBadge
                           text={v.type === 'out' ? 'Terkirim' : 'Diterima'}
                           textColor={Color.Base.White}
                           backgroundColor={v.type === 'out' ? Color["Red-Primary"] : Color.Green[500]}
                        />
                     </View>
                     <View style={GlobalStyles.rowSpaceBetween}>
                        <ThemedText type="Medium">Tanggal</ThemedText>
                        <ThemedText size="sm" color={Color.Text.Secondary}>
                           {moment().format("DD MMMM YYYY HH:mm")} WIB
                        </ThemedText>
                     </View>
                  </TouchableOpacity>
               )) : (
                  <View style={{marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
                     <ThemedText type="Medium">Belum ada history transfer</ThemedText>
                  </View>
               )
            }
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
   card: {
      backgroundColor: Color.Base.White,
      paddingVertical: scale(12),
      paddingTop: statusBarHeight ? statusBarHeight : scale(46),
      flex: 1,
      ...GlobalStyles.shadow,
   },
   countWrapper: {
      minWidth: scale(20),
      height: scale(20),
      paddingHorizontal: scale(4),
      backgroundColor: Color.Purple[50],
      borderRadius: Radius.xs,
      ...GlobalStyles.center,
   },
   taskWrapper: {
      backgroundColor: Color.Gray[50],
      padding: scale(12),
      borderWidth: 1,
      borderColor: Color.Gray[200],
      borderRadius: Radius.xs,
      width: '100%',
      alignSelf: 'center'
   },
   deadlineWrapper: {
      backgroundColor: Color.Base.White,
      paddingVertical: verticalScale(6),
      paddingHorizontal: scale(10),
      borderRadius: Radius.rounded,
      ...GlobalStyles.rowCenter,
      borderWidth: 1,
      borderColor: Color.Gray[300],
   },
   itemFilter: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Color.Border.Default,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default History;