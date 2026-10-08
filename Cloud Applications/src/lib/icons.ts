import {
  AppWindow, Users, BarChart3, Network, Palette, Activity, Cloud,
  Globe, Server, Database, Shield, Code, Layout, Zap, Box, Layers,
  Terminal, GitBranch, Cpu, Rocket, Lock, Mail, MessageSquare,
  ShoppingCart, CreditCard, FileText, Image, Video, Music,
  Map, Calendar, Clock, Star, Heart, Bell, Search, Settings,
  Home, Folder, Briefcase, Plane, Camera, Mic, Phone, Wifi,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  AppWindow, Users, BarChart3, Network, Palette, Activity, Cloud,
  Globe, Server, Database, Shield, Code, Layout, Zap, Box, Layers,
  Terminal, GitBranch, Cpu, Rocket, Lock, Mail, MessageSquare,
  ShoppingCart, CreditCard, FileText, Image, Video, Music,
  Map, Calendar, Clock, Star, Heart, Bell, Search, Settings,
  Home, Folder, Briefcase, Plane, Camera, Mic, Phone, Wifi,
};

export const availableIcons = Object.keys(iconMap).sort();

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || AppWindow;
}
