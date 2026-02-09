import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

interface TabBarIconProps {
  name: IoniconsName;
  color: string;
  focused: boolean;
}

export function TabBarIcon({ name, color, focused }: TabBarIconProps) {
  return (
    <Ionicons
      name={name}
      size={24}
      color={color}
      style={{
        marginBottom: -3,
        transform: [{ scale: focused ? 1.1 : 1 }],
      }}
    />
  );
}