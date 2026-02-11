import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';

interface WeeklyChartProps {
  data: Array<{ day: string; completions: number }>;
}

const screenWidth = Dimensions.get('window').width;

export function WeeklyChart({ data }: WeeklyChartProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text.primary }, theme.textStyles.h4]}>
        📈 This Week
      </Text>

      <VictoryChart
        width={screenWidth - 64}
        height={200}
        domainPadding={{ x: 20 }}
        theme={VictoryTheme.material}
      >
        <VictoryAxis
          style={{
            axis: { stroke: theme.colors.border.subtle },
            tickLabels: {
              fill: theme.colors.text.secondary,
              fontSize: 10,
            },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: theme.colors.border.subtle },
            tickLabels: {
              fill: theme.colors.text.secondary,
              fontSize: 10,
            },
            grid: { stroke: theme.colors.border.subtle, strokeWidth: 0.5 },
          }}
        />
        <VictoryBar
          data={data}
          x="day"
          y="completions"
          style={{
            data: {
              fill: theme.colors.accent.purple,
              borderRadius: 4,
            },
          }}
          cornerRadius={{ top: 4 }}
        />
      </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
});