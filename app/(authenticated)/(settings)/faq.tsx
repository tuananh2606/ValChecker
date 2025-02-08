import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../../_layout";
import { List } from "react-native-paper";

export default function FAQScreen() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  return (
    <ScrollView style={styles.container}>
      <List.Section style={{ flex: 1 }}>
        <List.Subheader>{t("settings.faq.can_not_login")}</List.Subheader>
        <View
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: colors.card,
          }}
        >
          <Text style={{ color: colors.text }}>
            {t("settings.faq.can_not_login_content")}
          </Text>
        </View>
        <List.Subheader>{t("settings.faq.invalid_session_id")}</List.Subheader>
        <List.Subheader>{t("settings.faq.app_end_date")}</List.Subheader>
        <View
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: colors.card,
          }}
        >
          <Text style={{ color: colors.text }}>
            {t("settings.faq.app_end_date_content")}
          </Text>
        </View>
        <List.Subheader>{t("settings.faq.is_account_safe")}</List.Subheader>
        <View
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: colors.card,
          }}
        >
          <Text style={{ color: colors.text }}>
            {t("settings.faq.is_account_safe_content")}
          </Text>
        </View>
        <List.Subheader>{t("settings.faq.get_banned")}</List.Subheader>
        <View
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: colors.card,
          }}
        >
          <Text style={{ color: colors.text }}>
            {t("settings.faq.get_banned_content")}
          </Text>
        </View>
        <View
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            marginTop: 32,
            backgroundColor: colors.card,
          }}
        >
          <Text style={{ color: colors.text }}>{t("settings.faq.remind")}</Text>
        </View>
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});
