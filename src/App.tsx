import React, { useState, useMemo, useEffect } from 'react';
import {
  Smartphone, ShoppingCart, Barcode, Search, Printer, DollarSign,
  TrendingUp, ShieldCheck, Package, Plus, Trash2, X, CheckCircle2,
  RefreshCw, PhoneCall, MapPin, Store, Edit3, Save, PlusCircle,
  Lock, KeyRound, Receipt, Settings2, Layers, AlertCircle, ArrowUpRight,
  Percent, Key, Wifi, WifiOff, History, Eye, CreditCard, Wallet,
  Calendar, BookOpen, UserMinus, UserCheck, Sparkles, HelpCircle
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// إعداد الاتصال السحابي بقاعدة بيانات Supabase
const supabaseUrl = 'https://rcrtefmjetywyffcaoac.supabase.co';
const supabaseAnonKey = 'sb_publishable_SMzh_506w_hNCd7VMHFmow_e64G9afm';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const STORE_INFO = {
  name: "قشعاوي للاتصالات والإكسسوارات الذكية",
  tagline: "صنعاء - شارع القصر - سامي مول - محل رقم 29",
  phone: "772606321",
  currency: "YER"
};

export type Role = 'admin' | 'accountant';
export type PaymentMethod = 'نقد (كاش)' | 'محفظة جيب' | 'الكريمي (إم فلوس)' | 'محفظة جوالي' | 'محفظة كاش' | 'آجل (دين)';

// --- مكونات توثيق باوزير للحلول البرمجية ---
export function BawazirLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.6" />
      <path d="M50 15 L55 22 L63 20 L66 28 L74 29 L74 37 L82 41 L79 49 L84 55 L79 61 L82 69 L74 72 L74 80 L66 82 L63 89 L55 88 L50 95 L45 88 L37 89 L34 82 L26 80 L26 72 L18 69 L21 61 L16 55 L21 49 L18 41 L26 37 L26 29 L34 28 L37 20 L45 22 Z" stroke="#38bdf8" strokeWidth="2.5" strokeLinejoin="round" fill="#0f172a" />
      <circle cx="50" cy="50" r="28" fill="#0284c7" fillOpacity="0.2" stroke="#00f2fe" strokeWidth="2" />
      <path d="M50 22 V34 M50 66 V78 M22 50 H34 M66 50 H78" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
      <text x="50" y="56" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="900" fontFamily="sans-serif">B&S</text>
    </svg>
  );
}

export function BawazirFooter() {
  return (
    <footer className="w-full border-t border-blue-200 bg-white/95 backdrop-blur-sm py-2.5 px-4 shadow-sm shrink-0 no-print" dir="rtl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <BawazirLogo className="w-5 h-5 flex-shrink-0" />
          <span className="font-bold text-slate-800">باوزير للحلول البرمجية</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline text-[11px] text-slate-500">جميع الحقوق محفوظة © 2026</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">v2.0.0 Pro</span>
          <a href="https://wa.me/967778403240" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-mono text-blue-600 hover:text-blue-700 font-bold" dir="ltr">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            +967 778 403 240
          </a>
        </div>
      </div>
    </footer>
  );
}

export function BawazirInvoiceFooter() {
  return (
    <div className="w-full pt-3 mt-4 border-t border-dashed border-gray-400 text-center text-[10px] text-gray-600 font-sans" dir="rtl">
      <p className="font-bold text-gray-800">تم إصدار الفاتورة عبر نظام باوزير للحلول البرمجية</p>
      <p className="font-mono tracking-wider mt-0.5 text-gray-700 font-semibold" dir="ltr">الدعم الفني والأنظمة: 778403240</p>
    </div>
  );
}

// --- الواجهات البرمجية ---
export interface Device {
  id: string;
  name: string;
  barcode: string;
  category: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  compatibility?: string;
}

export interface CartItem {
  device: Device;
  quantity: number;
  salePrice: number;
}

export interface SaleRecord {
  id: string;
  items: CartItem[];
  totalAmount: number;
  totalCost: number;
  discount: number;
  netAmount: number;
  profit: number;
  paymentMethod: PaymentMethod;
  customerName?: string;
  customerPhone?: string;
  paymentRef?: string;
  isDebtPaid?: boolean;
  date: string;
  time: string;
  cashier: string;
}

export interface ExpenseRecord {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  time: string;
  user: string;
}

export default function App() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingSync, setPendingSync] = useState<{ type: string; payload: any }[]>(() => {
    const local = localStorage.getItem('qash_pending_sync');
    return local ? JSON.parse(local) : [];
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // إدارة PIN والمدير
  const [adminPin, setAdminPin] = useState<string>(() => localStorage.getItem('qash_admin_pin') || '772606321');
  const [role, setRole] = useState<Role>('admin');
  const [pinInput, setPinInput] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');

  // التبويبات (إضافة تبويب الديون والتنبؤ)
  const [activeTab, setActiveTab] = useState<'pos' | 'sales' | 'debts' | 'devices' | 'categories' | 'expenses' | 'reports' | 'forecast'>('pos');

  // فلترة تقارير الأرباح
  const [reportFilter, setReportFilter] = useState<'today' | 'this_month' | 'all'>('this_month');

  // الأقسام والمخزون
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('qash_categories');
    return saved ? JSON.parse(saved) : ['كفرات آيفون', 'كفرات سامسونج', 'هواتف ذكية', 'شواحن ومحولات', 'سماعات', 'حمايات شاشة'];
  });
  const [newCatInput, setNewCatInput] = useState('');

  const [devices, setDevices] = useState<Device[]>(() => {
    const local = localStorage.getItem('qash_devices');
    if (local) return JSON.parse(local);
    return [
      { id: 'ip-16pm', name: 'كفر MagSafe حماية عدسات iPhone 16 Pro Max', barcode: '160001', category: 'كفرات آيفون', costPrice: 1500, salePrice: 3000, stock: 15, compatibility: 'iPhone 16 Pro Max' },
      { id: 'ip-15pm', name: 'كفر درع ضد الصدمات كربون iPhone 15 Pro Max', barcode: '150001', category: 'كفرات آيفون', costPrice: 1400, salePrice: 3000, stock: 20, compatibility: 'iPhone 15 Pro Max' },
      { id: 'sam-s24u', name: 'كفر شفاف أصلي بستاند معدني Galaxy S24 Ultra', barcode: '240001', category: 'كفرات سامسونج', costPrice: 1500, salePrice: 3500, stock: 14, compatibility: 'Samsung S24 Ultra' },
      { id: 'acc-1', name: 'شاحن أصلي سريع 67W شاومي', barcode: '693417770192', category: 'شواحن ومحولات', costPrice: 4000, salePrice: 6500, stock: 18, compatibility: 'Type-C' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('qash_categories', JSON.stringify(categories));
    localStorage.setItem('qash_devices', JSON.stringify(devices));
  }, [categories, devices]);

  // السلة والمبيعات
  const [cart, setCart] = useState<CartItem[]>([]);
  const [salesHistory, setSalesHistory] = useState<SaleRecord[]>(() => {
    const local = localStorage.getItem('qash_sales');
    return local ? JSON.parse(local) : [];
  });
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('نقد (كاش)');
  const [debtCustomerName, setDebtCustomerName] = useState('');
  const [debtCustomerPhone, setDebtCustomerPhone] = useState('');
  const [paymentRefNumber, setPaymentRefNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  // نوافذ الفواتير وتخيير الكاشير
  const [completedInvoice, setCompletedInvoice] = useState<SaleRecord | null>(null);
  const [showCheckoutChoiceModal, setShowCheckoutChoiceModal] = useState<boolean>(false);
  const [pendingSaleToFinalize, setPendingSaleToFinalize] = useState<SaleRecord | null>(null);

  // المصاريف (مع التعديل والحذف)
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const local = localStorage.getItem('qash_expenses');
    return local ? JSON.parse(local) : [];
  });
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('نثريات وتغذية');
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);

  // إدارة الأصناف
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [newDevName, setNewDevName] = useState('');
  const [newDevBarcode, setNewDevBarcode] = useState('');
  const [newDevCategory, setNewDevCategory] = useState('');
  const [newDevCostPrice, setNewDevCostPrice] = useState('');
  const [newDevSalePrice, setNewDevSalePrice] = useState('');
  const [newDevStock, setNewDevStock] = useState('10');
  const [newDevCompatibility, setNewDevCompatibility] = useState('');
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  // المزامنة السحابية للعمليات المعلقة
  const syncPendingData = async () => {
    const queue = JSON.parse(localStorage.getItem('qash_pending_sync') || '[]');
    if (queue.length === 0 || isSyncing) return;

    setIsSyncing(true);
    let remaining = [...queue];

    for (const item of queue) {
      if (item.type === 'expense') {
        const { error } = await supabase.from('expenses').insert([item.payload]);
        if (!error) remaining = remaining.filter(q => q !== item);
      } else if (item.type === 'sale') {
        const { error } = await supabase.from('sales').insert([item.payload]);
        if (!error) remaining = remaining.filter(q => q !== item);
      }
    }

    setPendingSync(remaining);
    localStorage.setItem('qash_pending_sync', JSON.stringify(remaining));
    setIsSyncing(false);
  };

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); syncPendingData(); };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.onLine) syncPendingData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const filteredDevices = useMemo(() => {
    return devices.filter(dev => {
      const matchSearch = dev.name.toLowerCase().includes(searchQuery.toLowerCase()) || dev.barcode.includes(searchQuery);
      const matchCat = selectedCategory === 'الكل' || dev.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [devices, searchQuery, selectedCategory]);

  const addToCart = (device: Device) => {
    if (device.stock <= 0) {
      alert('الكمية نافذة من المخزن تماماً!');
      return;
    }
    setCart(prev => {
      const exist = prev.find(item => item.device.id === device.id);
      if (exist) {
        if (exist.quantity >= device.stock) {
          alert(`الكمية المتوفرة في المخزن هي ${device.stock} فقط!`);
          return prev;
        }
        return prev.map(item => item.device.id === device.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { device, quantity: 1, salePrice: device.salePrice }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.device.id !== id));

  const updateCartQuantity = (id: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return; }
    const dev = devices.find(d => d.id === id);
    if (dev && qty > dev.stock) {
      alert(`المتوفر في المخزن ${dev.stock} فقط!`);
      return;
    }
    setCart(prev => prev.map(i => i.device.id === id ? { ...i, quantity: qty } : item));
  };

  const subTotalAmount = useMemo(() => cart.reduce((sum, i) => sum + (i.salePrice * i.quantity), 0), [cart]);
  const finalTotalAmount = Math.max(0, subTotalAmount - discountAmount);

  // إتمام البيع مع دعم الديون
  const handleInitiateCheckout = () => {
    if (cart.length === 0) return;
    if (selectedPaymentMethod === 'آجل (دين)' && !debtCustomerName.trim()) {
      alert('يرجى إدخال اسم العميل لتسجيل المديونية في الدفتر!');
      return;
    }

    const totalCost = cart.reduce((sum, item) => sum + (item.device.costPrice * item.quantity), 0);
    const profit = finalTotalAmount - totalCost;

    const newSale: SaleRecord = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      items: [...cart],
      totalAmount: subTotalAmount,
      discount: discountAmount,
      netAmount: finalTotalAmount,
      totalCost,
      profit,
      paymentMethod: selectedPaymentMethod,
      customerName: selectedPaymentMethod === 'آجل (دين)' ? debtCustomerName.trim() : undefined,
      customerPhone: selectedPaymentMethod === 'آجل (دين)' ? debtCustomerPhone.trim() : undefined,
      paymentRef: paymentRefNumber.trim() || undefined,
      isDebtPaid: selectedPaymentMethod !== 'آجل (دين)',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' }),
      cashier: role === 'admin' ? 'صاحب المحل (المدير)' : 'العامل (المحاسب)'
    };

    setPendingSaleToFinalize(newSale);
    setShowCheckoutChoiceModal(true);
  };

  const handleConfirmCheckout = (withPrint: boolean) => {
    if (!pendingSaleToFinalize) return;

    setDevices(prev =>
      prev.map(dev => {
        const inCart = pendingSaleToFinalize.items.find(c => c.device.id === dev.id);
        return inCart ? { ...dev, stock: dev.stock - inCart.quantity } : dev;
      })
    );

    const updated = [pendingSaleToFinalize, ...salesHistory];
    setSalesHistory(updated);
    localStorage.setItem('qash_sales', JSON.stringify(updated));

    // مزامنة سحابية
    const payload = {
      id: pendingSaleToFinalize.id,
      items: pendingSaleToFinalize.items,
      total_amount: pendingSaleToFinalize.totalAmount,
      discount: pendingSaleToFinalize.discount,
      net_amount: pendingSaleToFinalize.netAmount,
      total_cost: pendingSaleToFinalize.totalCost,
      profit: pendingSaleToFinalize.profit,
      cashier: `${pendingSaleToFinalize.cashier} (${pendingSaleToFinalize.paymentMethod})`
    };

    if (navigator.onLine) {
      supabase.from('sales').insert([payload]).then(({ error }) => {
        if (error) setPendingSync(prev => [...prev, { type: 'sale', payload }]);
      });
    } else {
      setPendingSync(prev => [...prev, { type: 'sale', payload }]);
    }

    setShowCheckoutChoiceModal(false);
    setCart([]);
    setDiscountAmount(0);
    setDebtCustomerName('');
    setDebtCustomerPhone('');
    setPaymentRefNumber('');

    if (withPrint) {
      setCompletedInvoice(pendingSaleToFinalize);
    } else {
      alert(`تم حفظ البيع بنجاح برقم (${pendingSaleToFinalize.id}).`);
    }
    setPendingSaleToFinalize(null);
  };

  // تسديد الدين
  const handlePayDebt = (saleId: string) => {
    if (confirm('هل تم استلام المبلغ وتسديد الدين بالكامل؟')) {
      const updated = salesHistory.map(s => s.id === saleId ? { ...s, isDebtPaid: true } : s);
      setSalesHistory(updated);
      localStorage.setItem('qash_sales', JSON.stringify(updated));
      alert('تم تحديث حالة الدين إلى (مسدد) بنجاح.');
    }
  };

  // حذف فاتورة مبيعات مع إرجاع الكميات
  const handleDeleteSale = (saleId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الفاتورة؟ سيتم إرجاع جميع الأصناف إلى المخزن تلقائياً.')) {
      const saleToDelete = salesHistory.find(s => s.id === saleId);
      if (saleToDelete) {
        setDevices(prev =>
          prev.map(dev => {
            const returnedItem = saleToDelete.items.find(i => i.device.id === dev.id);
            return returnedItem ? { ...dev, stock: dev.stock + returnedItem.quantity } : dev;
          })
        );
      }

      const updated = salesHistory.filter(s => s.id !== saleId);
      setSalesHistory(updated);
      localStorage.setItem('qash_sales', JSON.stringify(updated));

      if (navigator.onLine) {
        supabase.from('sales').delete().eq('id', saleId).then(() => {});
      }
      alert('تم حذف الفاتورة وإعادة الكميات للمخزن بنجاح.');
    }
  };

  // إدارة الخرج والمصروفات (إضافة + تعديل + حذف)
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(expenseAmount);
    if (!expenseTitle.trim() || isNaN(amountNum) || amountNum <= 0) return;

    if (editingExpense) {
      // تعديل
      const updated = expenses.map(exp => exp.id === editingExpense.id ? {
        ...exp,
        title: expenseTitle.trim(),
        category: expenseCategory,
        amount: amountNum
      } : exp);
      setExpenses(updated);
      localStorage.setItem('qash_expenses', JSON.stringify(updated));
      alert('تم تعديل حركة الخرج بنجاح!');
    } else {
      // إضافة جديدة
      const newExp: ExpenseRecord = {
        id: `exp-${Date.now()}`,
        title: expenseTitle.trim(),
        category: expenseCategory,
        amount: amountNum,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' }),
        user: role === 'admin' ? 'صاحب المحل (المدير)' : 'العامل (المحاسب)'
      };
      const updated = [newExp, ...expenses];
      setExpenses(updated);
      localStorage.setItem('qash_expenses', JSON.stringify(updated));

      const payload = { category: expenseCategory, amount: amountNum, title: expenseTitle.trim() };
      if (navigator.onLine) {
        supabase.from('expenses').insert([payload]).then(({ error }) => {
          if (error) setPendingSync(prev => [...prev, { type: 'expense', payload }]);
        });
      } else {
        setPendingSync(prev => [...prev, { type: 'expense', payload }]);
      }
      alert('تم تسجيل الخرج بنجاح!');
    }

    setIsExpenseModalOpen(false);
    setEditingExpense(null);
    setExpenseTitle('');
    setExpenseAmount('');
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('هل أنت متأكد من حذف حركة الخرج هذه؟')) {
      const updated = expenses.filter(e => e.id !== id);
      setExpenses(updated);
      localStorage.setItem('qash_expenses', JSON.stringify(updated));
      if (navigator.onLine) {
        supabase.from('expenses').delete().eq('id', id).then(() => {});
      }
      alert('تم حذف حركة الخرج بنجاح.');
    }
  };

  // فلترة تقارير الأرباح
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const todayDate = new Date().toISOString().split('T')[0];

  const filteredSalesForReports = useMemo(() => {
    if (reportFilter === 'today') return salesHistory.filter(s => s.date === todayDate);
    if (reportFilter === 'this_month') return salesHistory.filter(s => s.date.startsWith(currentMonth));
    return salesHistory;
  }, [salesHistory, reportFilter, todayDate, currentMonth]);

  const filteredExpensesForReports = useMemo(() => {
    if (reportFilter === 'today') return expenses.filter(e => e.date === todayDate);
    if (reportFilter === 'this_month') return expenses.filter(e => e.date.startsWith(currentMonth));
    return expenses;
  }, [expenses, reportFilter, todayDate, currentMonth]);

  const reportTotalSales = filteredSalesForReports.reduce((sum, s) => sum + s.netAmount, 0);
  const reportTotalProfit = filteredSalesForReports.reduce((sum, s) => sum + s.profit, 0);
  const reportTotalExpenses = filteredExpensesForReports.reduce((sum, e) => sum + e.amount, 0);
  const reportNetCleanProfit = reportTotalProfit - reportTotalExpenses;

  // خوارزمية التنبؤ الذكي بالمبيعات لنهاية الشهر
  const daysInCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentDayNumber = new Date().getDate();
  const daysPassed = Math.max(1, currentDayNumber);

  const thisMonthSales = salesHistory.filter(s => s.date.startsWith(currentMonth));
  const monthSalesSum = thisMonthSales.reduce((sum, s) => sum + s.netAmount, 0);
  const monthProfitSum = thisMonthSales.reduce((sum, s) => sum + s.profit, 0);

  const dailyAverageSales = monthSalesSum / daysPassed;
  const dailyAverageProfit = monthProfitSum / daysPassed;

  const predictedMonthSales = dailyAverageSales * daysInCurrentMonth;
  const predictedMonthProfit = dailyAverageProfit * daysInCurrentMonth;

  return (
    <div className="w-full bg-slate-100 text-slate-800 flex flex-col font-sans min-h-screen" dir="rtl" style={{ height: '100vh', overflowY: 'auto' }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-receipt, #printable-receipt * { visibility: visible; }
          #printable-receipt {
            position: absolute; left: 0; top: 0; width: 80mm;
            padding: 5mm; font-size: 12px; color: #000; background: #fff;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* الترويسة العلوية */}
      <header className="bg-white border-b border-blue-200 px-6 py-4 flex flex-wrap justify-between items-center gap-4 shadow-sm shrink-0 no-print">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-md shadow-blue-500/20">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-blue-950 tracking-tight">{STORE_INFO.name}</h1>
              {isOnline ? (
                <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-emerald-600" />
                  متصل سحابياً
                </span>
              ) : (
                <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <WifiOff className="w-3 h-3 text-amber-600" />
                  أوفلاين
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              {STORE_INFO.tagline} | هاتف: {STORE_INFO.phone}
            </p>
          </div>
        </div>

        {/* أزرار التبويبات المتكاملة */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300 text-sm flex-wrap gap-1">
            <button onClick={() => setActiveTab('pos')} className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${activeTab === 'pos' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:text-blue-600'}`}>
              <ShoppingCart className="w-4 h-4" /> الكاشير
            </button>
            <button onClick={() => setActiveTab('sales')} className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${activeTab === 'sales' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:text-blue-600'}`}>
              <History className="w-4 h-4" /> الفواتير
            </button>
            <button onClick={() => setActiveTab('debts')} className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${activeTab === 'debts' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:text-blue-600'}`}>
              <BookOpen className="w-4 h-4" /> دفتر الديون
            </button>
            <button onClick={() => setActiveTab('expenses')} className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${activeTab === 'expenses' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:text-blue-600'}`}>
              <DollarSign className="w-4 h-4" /> الخرج اليومي
            </button>
            {role === 'admin' && (
              <>
                <button onClick={() => setActiveTab('devices')} className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${activeTab === 'devices' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:text-blue-600'}`}>
                  <Package className="w-4 h-4" /> المخزون
                </button>
                <button onClick={() => setActiveTab('reports')} className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${activeTab === 'reports' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:text-blue-600'}`}>
                  <TrendingUp className="w-4 h-4" /> تقرير الأرباح
                </button>
                <button onClick={() => setActiveTab('forecast')} className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${activeTab === 'forecast' ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-700 hover:bg-indigo-50'}`}>
                  <Sparkles className="w-4 h-4" /> التنبؤ بالمبيعات
                </button>
              </>
            )}
          </div>

          {role === 'admin' ? (
            <button onClick={() => setRole('accountant')} className="px-3 py-2 bg-blue-100 text-blue-900 border border-blue-300 rounded-xl text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-700" /> المدير
            </button>
          ) : (
            <button onClick={() => setShowPinModal(true)} className="px-3.5 py-2 bg-slate-300 hover:bg-slate-400 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1">
              <Lock className="w-4 h-4" /> دخول كمدير
            </button>
          )}
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 p-6 w-full max-w-7xl mx-auto block pb-20 no-print">
        {/* تبويب الكاشير */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث باسم الغلاف، الهاتف، أو امسح الباركود..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-2xl px-4 py-3.5 pl-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
                />
                <Search className="absolute left-3.5 top-4 w-5 h-5 text-blue-500" />
              </div>

              {/* أزرار الأقسام */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {['الكل', ...categories].map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl text-xs whitespace-nowrap font-bold transition ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-blue-200 text-slate-700 hover:bg-blue-50'}`}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* شبكة الكروت */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredDevices.map(dev => (
                  <div key={dev.id} onClick={() => addToCart(dev)} className="bg-white p-4 rounded-2xl border-2 border-blue-100 hover:border-blue-400 transition cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md group min-h-[185px]">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-lg border border-blue-200">{dev.category}</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-md font-black ${dev.stock <= 3 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>المتبقي: {dev.stock}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 mt-2.5 leading-snug text-sm group-hover:text-blue-600 transition">{dev.name}</h3>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-end">
                      <p className="text-base font-black text-blue-600">{dev.salePrice.toLocaleString()} {STORE_INFO.currency}</p>
                      <button className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"><Plus className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* سلة البيع مع تحديد طريقة الدفع ونظام الدين */}
            <div className="bg-white border-2 border-blue-100 rounded-3xl p-5 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between border-b border-blue-100 pb-3 mb-4">
                  <h2 className="font-bold text-base flex items-center gap-2 text-blue-950"><ShoppingCart className="w-5 h-5 text-blue-600" /> فاتورة البيع</h2>
                  <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-xl font-bold">{cart.length} أصناف</span>
                </div>

                <div className="space-y-3 max-h-[220px] overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.device.id} className="flex justify-between items-center bg-blue-50/50 p-3 rounded-2xl border border-blue-200">
                      <div className="flex-1 pr-1">
                        <p className="font-bold text-sm text-slate-900 leading-tight">{item.device.name}</p>
                        <p className="text-xs text-blue-700 font-black mt-1">{item.salePrice.toLocaleString()} {STORE_INFO.currency}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateCartQuantity(item.device.id, item.quantity - 1)} className="w-7 h-7 bg-white border border-slate-300 rounded-lg font-bold text-slate-700">-</button>
                        <span className="w-6 text-center text-sm font-black text-slate-800">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.device.id, item.quantity + 1)} className="w-7 h-7 bg-white border border-slate-300 rounded-lg font-bold text-slate-700">+</button>
                        <button onClick={() => removeFromCart(item.device.id)} className="text-rose-500 hover:text-rose-600 p-1 mr-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                  {cart.length === 0 && (
                    <div className="text-center py-8 text-slate-400"><ShoppingCart className="w-10 h-10 mx-auto opacity-30 mb-1" /><p className="text-xs font-medium">السلة فارغة</p></div>
                  )}
                </div>
              </div>

              {/* طرق الدفع مع خيار الآجل (الدين) */}
              <div className="border-t border-slate-100 pt-3 mt-3 space-y-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5 text-blue-600" /> طريقة الدفع:
                  </label>
                  <select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="نقد (كاش)">نقد (كاش)</option>
                    <option value="محفظة جيب">محفظة جيب (Jeeb)</option>
                    <option value="الكريمي (إم فلوس)">الكريمي (حاسب / إم فلوس)</option>
                    <option value="محفظة جوالي">محفظة جوالي (Jawali)</option>
                    <option value="محفظة كاش">محفظة كاش (Cash)</option>
                    <option value="آجل (دين)">آجل (دين على العميل)</option>
                  </select>
                </div>

                {selectedPaymentMethod === 'آجل (دين)' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="اسم العميل المديون (ضروري)..."
                      value={debtCustomerName}
                      onChange={(e) => setDebtCustomerName(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl p-2 text-xs font-bold text-slate-900 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="رقم هاتف العميل (اختياري)..."
                      value={debtCustomerPhone}
                      onChange={(e) => setDebtCustomerPhone(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl p-2 text-xs font-bold text-slate-900 focus:outline-none font-mono"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1"><Percent className="w-3.5 h-3.5 text-blue-600" /> خصم للزبون:</span>
                  <input type="number" placeholder="0" value={discountAmount || ''} onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)} className="w-24 bg-white border border-slate-300 rounded-lg px-2 py-1 text-center font-bold text-rose-600 text-xs focus:outline-none" />
                </div>

                <div className="flex justify-between items-center text-slate-900 text-sm font-black">
                  <span>المبلغ الصافي:</span>
                  <span className="text-xl text-blue-600">{finalTotalAmount.toLocaleString()} {STORE_INFO.currency}</span>
                </div>

                <button onClick={handleInitiateCheckout} disabled={cart.length === 0} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md text-sm">
                  <Receipt className="w-4 h-4" /> إتمام العملية (طباعة أو حفظ)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* تبويب دفتر الديون (بيع آجل) */}
        {activeTab === 'debts' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2"><BookOpen className="w-5 h-5 text-amber-600" /> دفتر ديون العملاء (البيع الآجل)</h2>
                <p className="text-xs text-slate-500 mt-0.5">متابعة حسابات الزبائن وتأكيد تسديد المديونيات</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left">
                <span className="text-xs font-bold text-amber-800 block">إجمالي ديون المحل بالسوق:</span>
                <span className="text-xl font-black text-amber-600">
                  {salesHistory.filter(s => s.paymentMethod === 'آجل (دين)' && !s.isDebtPaid).reduce((sum, s) => sum + s.netAmount, 0).toLocaleString()} {STORE_INFO.currency}
                </span>
              </div>
            </div>

            <div className="bg-white border border-blue-200 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-right text-sm">
                <thead className="bg-blue-50/70 text-blue-900 border-b border-blue-100">
                  <tr>
                    <th className="p-4 font-bold">اسم العميل</th>
                    <th className="p-4 font-bold">رقم الهاتف</th>
                    <th className="p-4 font-bold">رقم الفاتورة والتاريخ</th>
                    <th className="p-4 font-bold">مبلغ الدين</th>
                    <th className="p-4 font-bold">الحالة</th>
                    <th className="p-4 text-center font-bold">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salesHistory.filter(s => s.paymentMethod === 'آجل (دين)').map(debt => (
                    <tr key={debt.id} className="hover:bg-amber-50/30">
                      <td className="p-4 font-bold text-slate-900">{debt.customerName || 'عميل غير مسجل'}</td>
                      <td className="p-4 font-mono text-xs text-slate-600">{debt.customerPhone || '-'}</td>
                      <td className="p-4 text-xs text-slate-500">{debt.id} ({debt.date})</td>
                      <td className="p-4 font-black text-rose-600">{debt.netAmount.toLocaleString()} {STORE_INFO.currency}</td>
                      <td className="p-4">
                        {debt.isDebtPaid ? (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> مسدد بالكامل
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold inline-flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> معلق (مطلوب)
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {!debt.isDebtPaid && (
                          <button onClick={() => handlePayDebt(debt.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1 shadow-sm">
                            <UserCheck className="w-3.5 h-3.5" /> تسديد الدين
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {salesHistory.filter(s => s.paymentMethod === 'آجل (دين)').length === 0 && (
                    <tr><td colSpan={6} className="p-10 text-center text-slate-400">لا توجد ديون مسجلة في الدفتر</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* تبويب تقارير الأرباح المتقدمة (يومي / شهري) */}
        {activeTab === 'reports' && role === 'admin' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-bold text-blue-950">تقارير وأرباح المحل المفصلة</h2>
                <p className="text-xs text-slate-500">حساب حقيقي لصافي الدخل بعد خصم التكلفة والمصروفات</p>
              </div>
              <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-300 text-xs font-bold">
                <button onClick={() => setReportFilter('today')} className={`px-3 py-1.5 rounded-lg ${reportFilter === 'today' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>أرباح اليوم</button>
                <button onClick={() => setReportFilter('this_month')} className={`px-3 py-1.5 rounded-lg ${reportFilter === 'this_month' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>أرباح هذا الشهر</button>
                <button onClick={() => setReportFilter('all')} className={`px-3 py-1.5 rounded-lg ${reportFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>الإجمالي الكلي</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-blue-200 shadow-sm">
                <p className="text-xs font-bold text-slate-500">إجمالي المبيعات</p>
                <h3 className="text-2xl font-black text-blue-600 mt-2">{reportTotalSales.toLocaleString()} {STORE_INFO.currency}</h3>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-blue-200 shadow-sm">
                <p className="text-xs font-bold text-slate-500">مجمل ربح البضاعة</p>
                <h3 className="text-2xl font-black text-sky-600 mt-2">+{reportTotalProfit.toLocaleString()} {STORE_INFO.currency}</h3>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-blue-200 shadow-sm">
                <p className="text-xs font-bold text-slate-500">إجمالي المصاريف والخرج</p>
                <h3 className="text-2xl font-black text-rose-600 mt-2">-{reportTotalExpenses.toLocaleString()} {STORE_INFO.currency}</h3>
              </div>
              <div className="bg-emerald-600 p-5 rounded-3xl text-white shadow-md">
                <p className="text-xs font-bold text-emerald-100">صافي الربح الحقيقي النهائي</p>
                <h3 className="text-2xl font-black mt-2">{reportNetCleanProfit.toLocaleString()} {STORE_INFO.currency}</h3>
              </div>
            </div>
          </div>
        )}

        {/* تبويب التنبؤ الذكي بالمبيعات (AI Sales Forecast) */}
        {activeTab === 'forecast' && role === 'admin' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white p-6 rounded-3xl shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-2xl"><Sparkles className="w-8 h-8 text-amber-300" /></div>
                <div>
                  <h2 className="text-xl font-black">نظام التنبؤ وتحليل المبيعات الذكي</h2>
                  <p className="text-xs text-indigo-200 mt-1">بناءً على وتيرة المبيعات الفعلية خلال {daysPassed} يوم الماضية من هذا الشهر</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <span className="text-xs text-indigo-200">متوسط مبيعات المحل اليومي:</span>
                  <p className="text-2xl font-black text-white mt-1">{Math.round(dailyAverageSales).toLocaleString()} {STORE_INFO.currency}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <span className="text-xs text-indigo-200">المبيعات المتوقعة بنهاية الشهر:</span>
                  <p className="text-2xl font-black text-amber-300 mt-1">{Math.round(predictedMonthSales).toLocaleString()} {STORE_INFO.currency}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <span className="text-xs text-indigo-200">صافي الأرباح المتوقع بنهاية الشهر:</span>
                  <p className="text-2xl font-black text-emerald-300 mt-1">{Math.round(predictedMonthProfit).toLocaleString()} {STORE_INFO.currency}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-blue-200 shadow-sm">
              <h3 className="text-base font-bold text-blue-950 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" /> توصيات ذكية لإعادة طلب البضاعة:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {devices.filter(d => d.stock <= 3).map(d => (
                  <div key={d.id} className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="font-bold text-xs text-slate-800">{d.name}</p>
                      <p className="text-[11px] text-rose-600 font-bold mt-0.5">متبقي: {d.stock} قطع فقط</p>
                    </div>
                    <span className="px-2 py-1 bg-rose-600 text-white text-[10px] font-bold rounded-lg">اطلب الآن</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* تبويب الخرج اليومي (مع التعديل والحذف) */}
        {activeTab === 'expenses' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-blue-200 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-blue-950">إدارة وتعديل الخرج اليومي</h2>
                <p className="text-xs text-slate-500 mt-0.5">تسجيل فوري، إمكانية التعديل، والحذف المباشر</p>
              </div>
              <button
                onClick={() => { setEditingExpense(null); setExpenseTitle(''); setExpenseAmount(''); setIsExpenseModalOpen(true); }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> تسجيل خرج جديد
              </button>
            </div>

            <div className="bg-white border border-blue-200 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-right text-sm">
                <thead className="bg-blue-50/70 text-blue-900 border-b border-blue-100">
                  <tr>
                    <th className="p-4 font-bold">البيان</th>
                    <th className="p-4 font-bold">القسم</th>
                    <th className="p-4 font-bold">المبلغ</th>
                    <th className="p-4 font-bold">الوقت والتاريخ</th>
                    <th className="p-4 text-center font-bold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-blue-50/40">
                      <td className="p-4 font-bold text-slate-900">{exp.title}</td>
                      <td className="p-4 text-slate-500">{exp.category}</td>
                      <td className="p-4 font-black text-rose-600">-{exp.amount.toLocaleString()} {STORE_INFO.currency}</td>
                      <td className="p-4 text-slate-500 text-xs">{exp.date} {exp.time}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingExpense(exp);
                              setExpenseTitle(exp.title);
                              setExpenseAmount(String(exp.amount));
                              setExpenseCategory(exp.category);
                              setIsExpenseModalOpen(true);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="تعديل حركة الخرج"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="حذف حركة الخرج"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                    <tr><td colSpan={5} className="p-10 text-center text-slate-400">لا توجد مصاريف مسجلة حتى الآن</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* باقي التبويبات (المبيعات والمخزون) كما هي مع التنسيق الجديد */}
        {activeTab === 'sales' && (
          <div className="space-y-4">
            <div className="bg-white border border-blue-200 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-right text-sm">
                <thead className="bg-blue-50/70 text-blue-900 border-b border-blue-100">
                  <tr>
                    <th className="p-4 font-bold">رقم الفاتورة</th>
                    <th className="p-4 font-bold">التاريخ والوقت</th>
                    <th className="p-4 font-bold">الأصناف المباعة</th>
                    <th className="p-4 font-bold">طريقة الدفع</th>
                    <th className="p-4 font-bold">المبلغ الصافي</th>
                    {role === 'admin' && <th className="p-4 font-bold">صافي الربح</th>}
                    <th className="p-4 text-center font-bold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salesHistory.map(sale => (
                    <tr key={sale.id} className="hover:bg-blue-50/40">
                      <td className="p-4 font-bold text-blue-700 font-mono">{sale.id}</td>
                      <td className="p-4 text-xs text-slate-500">{sale.date} {sale.time}</td>
                      <td className="p-4 text-xs text-slate-700">{sale.items.map(i => `${i.device.name} (x${i.quantity})`).join(', ')}</td>
                      <td className="p-4 font-bold text-xs">{sale.paymentMethod}</td>
                      <td className="p-4 font-black text-slate-900">{sale.netAmount.toLocaleString()} {STORE_INFO.currency}</td>
                      {role === 'admin' && <td className="p-4 font-black text-emerald-600">+{sale.profit.toLocaleString()} {STORE_INFO.currency}</td>}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => setCompletedInvoice(sale)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Printer className="w-4 h-4" /></button>
                          {role === 'admin' && <button onClick={() => handleDeleteSale(sale.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'devices' && role === 'admin' && (
          <div className="bg-white p-6 rounded-3xl border border-blue-200 space-y-5 shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-blue-950">إدارة المخزون والكميات</h2>
              <button onClick={() => setIsAddDeviceModalOpen(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" /> إضافة صنف جديد
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-blue-50/70 text-blue-900 border-b border-blue-100">
                  <tr>
                    <th className="p-3.5 font-bold">اسم الصنف</th>
                    <th className="p-3.5 font-bold">سعر البيع</th>
                    <th className="p-3.5 font-bold">التكلفة</th>
                    <th className="p-3.5 font-bold">المتبقي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {devices.map(dev => (
                    <tr key={dev.id}>
                      <td className="p-3.5 font-bold text-slate-900">{dev.name}</td>
                      <td className="p-3.5 font-black text-blue-600">{dev.salePrice.toLocaleString()}</td>
                      <td className="p-3.5 text-slate-500">{dev.costPrice.toLocaleString()}</td>
                      <td className="p-3.5 font-bold text-emerald-700">{dev.stock} قطعة</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* نافذة خيار الطباعة أو الحفظ بدون طباعة */}
      {showCheckoutChoiceModal && pendingSaleToFinalize && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-blue-200 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-blue-950 mb-1">تم تسجيل الفاتورة بنجاح</h3>
            <p className="text-sm font-black text-slate-800 mb-4">المبلغ: <span className="text-blue-600">{pendingSaleToFinalize.netAmount.toLocaleString()} {STORE_INFO.currency}</span></p>
            <div className="space-y-2">
              <button onClick={() => handleConfirmCheckout(true)} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md">
                <Printer className="w-4 h-4" /> طباعة الفاتورة الورقية
              </button>
              <button onClick={() => handleConfirmCheckout(false)} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs">
                حفظ فقط بدون طباعة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* الفاتورة المجهزة للطباعة */}
      {completedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-blue-200 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div id="printable-receipt" className="text-center font-mono">
              <h2 className="text-base font-black text-slate-900">{STORE_INFO.name}</h2>
              <p className="text-[11px] text-slate-600">{STORE_INFO.tagline}</p>
              <div className="my-2 border-t border-b border-dashed border-slate-400 py-1 text-xs font-bold">
                فاتورة: {completedInvoice.id} | {completedInvoice.date} {completedInvoice.time}
              </div>
              <div className="text-right text-xs my-2 space-y-1">
                {completedInvoice.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{i.device.name} (x{i.quantity})</span>
                    <span>{(i.salePrice * i.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-slate-400 pt-2 text-xs space-y-1">
                <div className="flex justify-between font-black text-sm"><span>الإجمالي:</span><span>{completedInvoice.netAmount.toLocaleString()} {STORE_INFO.currency}</span></div>
                <div className="flex justify-between text-[11px] text-slate-600"><span>طريقة الدفع:</span><span>{completedInvoice.paymentMethod}</span></div>
              </div>
              <BawazirInvoiceFooter />
            </div>
            <div className="mt-4 flex gap-2 no-print">
              <button onClick={() => window.print()} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm"><Printer className="w-4 h-4" /> طباعة</button>
              <button onClick={() => setCompletedInvoice(null)} className="px-4 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-xl">إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تسجيل وتعديل الخرج اليومي */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-blue-200 rounded-3xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-blue-950 mb-4">{editingExpense ? 'تعديل حركة الخرج' : 'تسجيل خرج يومي جديد'}</h3>
            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">البيان</label>
                <input type="text" required value={expenseTitle} onChange={(e) => setExpenseTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-bold" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">المبلغ ({STORE_INFO.currency})</label>
                <input type="number" required value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-bold" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl">{editingExpense ? 'حفظ التعديل' : 'حفظ الخرج'}</button>
                <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="px-5 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة PIN */}
      {showPinModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-blue-200 rounded-3xl p-6 w-full max-w-xs shadow-xl text-center">
            <KeyRound className="w-10 h-10 text-blue-600 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-blue-950 mb-1">التحقق من هوية المدير</h3>
            <input type="password" placeholder="رمز PIN" value={pinInput} onChange={(e) => setPinInput(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-center text-slate-900 text-lg tracking-widest my-3 font-black" />
            <div className="flex gap-2">
              <button onClick={() => { if (pinInput === adminPin) { setRole('admin'); setShowPinModal(false); setPinInput(''); } else alert('رمز غير صحيح'); }} className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-xl">تأكيد</button>
              <button onClick={() => setShowPinModal(false)} className="px-4 py-2 bg-slate-200 font-bold rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      <BawazirFooter />
    </div>
  );
}