import {
   ThemedHeader,
   ThemedText
} from "@/components/ui";
import Color from '@/constants/Color';
import { getNotification } from "@/services/masterService";
import GlobalStyles from "@/styles/common";
import { scale } from "@/utils/scaleSize";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import moment from "moment";
import { useCallback, useState } from "react";
import {
   ActivityIndicator,
   FlatList,
   StatusBar,
   StyleSheet,
   TouchableOpacity,
   View
} from 'react-native';

const statusBarHeight = StatusBar.currentHeight;

const Notification = () => {

  const [list, setList] = useState([]);
  const [params, setParams] = useState({ page: 1 });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const formatDate = (date) => {
    const notifDate = moment(date);
    const today = moment();

    if (notifDate.isSame(today, 'day')) {
      return notifDate.format('HH:mm');
    }

    if (notifDate.isSame(today.clone().subtract(1, 'day'), 'day')) {
      return 'kemarin';
    }

    return notifDate.format('YYYY-MM-DD');
  };

  const filterAndSortData = (data) => {
    return data
      .filter(item => item?.created_at)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  const getData = async (page = 1, reset = false) => {
    if (loading && !reset) return;

    setLoading(true);
    const res = await getNotification({ page });

    if (res?.success) {
      const responseData = res?.data?.data?.data || [];
      const total = res?.data?.data?.total || 0;

      const filteredData = filterAndSortData(responseData);

      if (reset) {
        setList(filteredData);
      } else {
        setList(prev => [...prev, ...filteredData]);
      }

      if (
        filteredData.length === 0 ||
        (reset ? filteredData.length : list.length + filteredData.length) >= total
      ) {
        setHasMore(false);
      }
    }

    setLoading(false);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (loading || refreshing || !hasMore) return;
    const nextPage = params.page + 1;
    setParams({ page: nextPage });
    getData(nextPage);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    setParams({ page: 1 });
    getData(1, true);
  };

  const renderFooter = () => {
    if (!loading || refreshing || !hasMore) return null;

    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator size="small" color={Color.Green[500]} />
      </View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      setHasMore(true);
      setParams({ page: 1 });
      setList([]);
      getData(1, true);
    }, [])
  );

  return (
    <View style={styles.card}>
      <StatusBar translucent barStyle="light-content" />
      <ThemedHeader title="Notifikasi" />

      <View style={{ flex: 1, padding: 16 }}>
        {list.length === 0 && !loading ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <ThemedText size="sm" color="gray">
              Tidak ada notifikasi
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={list}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ gap: 12 }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListFooterComponent={renderFooter}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.itemCard}
              >
                <View style={{ width: '16%', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={styles.roundedIcon}>
                    <Ionicons
                      name="notifications"
                      size={24}
                     //  color={Color.Gray[300]}
                     color={Color.Base.White}
                    />
                  </View>
                </View>

                <View style={{ width: '84%', paddingLeft: 14, gap: 5 }}>
                  <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between'
                  }}>
                    <View style={{ width: '80%' }}>
                      <ThemedText numberOfLines={2} type="Medium" size="base">
                        {item?.data?.title}
                      </ThemedText>
                    </View>
                    <View style={{ width: '20%', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                     <ThemedText size="xs">
                        {formatDate(item.created_at)}
                     </ThemedText>
                    </View>
                  </View>

                  <ThemedText size="sm">
                    {item?.data?.message}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  roundedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Color.Green[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCard: {
    width: '100%',
    borderRadius: 6,
    padding: 10,
    backgroundColor: Color.Base.White,
    borderColor: Color.Gray[200],
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Color.Base.White,
    paddingVertical: scale(12),
    paddingTop: statusBarHeight ? statusBarHeight + 5 : scale(46),
    flex: 1,
    ...GlobalStyles.shadow,
  },
});

export default Notification;
