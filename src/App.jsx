import React, { useState, useEffect } from 'react';
import { Sprout, Wallet, ShieldCheck, ArrowRight, User, Lock, Mail, CheckCircle2, PlusCircle, DollarSign, Scissors, Bell, Home, Calendar, FileText, ChevronRight, TrendingUp, TrendingDown, Edit3, Trash2, LogOut, Camera, KeyRound } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('landing'); 
  const [activeTab, setActiveTab] = useState('beranda'); 
  const [filterStatus, setFilterStatus] = useState('Semua'); 
  const [subTabKeuangan, setSubTabKeuangan] = useState('ringkasan'); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');
  const [editNama, setEditNama] = useState('');
  const [editEmail, setEditEmail] = useState('');
  
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState(null);

  const [tanamanList, setTanamanList] = useState([]);
  const [keuanganData, setKeuanganData] = useState({ totalPemasukan: 0, totalPengeluaran: 0, cuanBersih: 0, transaksi: [] });
  
  const [namaTanaman, setNamaTanaman] = useState('');
  const [varietas, setVarietas] = useState('');
  const [jumlahBibit, setJumlahBibit] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [modalAwal, setModalAwal] = useState('');
  const [tanggalTanamInput, setTanggalTanamInput] = useState(new Date().toISOString().split('T')[0]);

  const [selectedTanaman, setSelectedTanaman] = useState(null);
  const [hargaJual, setHargaJual] = useState('');
  const [jumlahHasil, setJumlahHasil] = useState('');
  const [catatanPanen, setCatatanPanen] = useState('');
  const [tanggalPanenInput, setTanggalPanenInput] = useState(new Date().toISOString().split('T')[0]);

  const [selectedTrxId, setSelectedTrxId] = useState(null);
  const [kategoriKeuangan, setKategoriKeuangan] = useState('Pupuk');
  const [nominalKeuangan, setNominalKeuangan] = useState('');
  const [keteranganKeuangan, setKeteranganKeuangan] = useState('');
  const [tipeKeuangan, setTipeKeuangan] = useState('PENGELUARAN');
  const [tanggalKeuanganInput, setTanggalKeuanganInput] = useState(new Date().toISOString().split('T')[0]);

  // Fungsi Dynamic Background berdasarkan View (menggunakan file jpg di folder public)
  const getBackgroundImage = () => {
    if (view === 'landing') {
      return "url('/landing.jpg')";
    } else if (view === 'login' || view === 'register') {
      return "url('/register.jpg')";
    } else {
      return "url('/lainnya.jpg')";
    }
  };

  const fetchDataDashboard = async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return;
    
    try {
      const resTanaman = await fetch('http://localhost:5000/api/tanaman', {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      if (resTanaman.ok) {
        const dataT = await resTanaman.json();
        setTanamanList(dataT);
      }

      const resKeuangan = await fetch('http://localhost:5000/api/keuangan', {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      if (resKeuangan.ok) {
        const dataK = await resKeuangan.json();
        setKeuanganData(dataK);
      }
    } catch (err) {
      console.error("Gagal memuat data backend:", err);
    }
  };

  useEffect(() => {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      fetchDataDashboard();
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, password, role: 'USER' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert('Registrasi Berhasil! Silakan masuk.');
      setView('login');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      localStorage.setItem('token', data.token);
      setUserData(data.user);
      setView('dashboard');
      fetchDataDashboard();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const currentToken = localStorage.getItem('token');
    if (!currentToken) { setView('login'); return; }

    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentToken}` },
        body: JSON.stringify({ nama: editNama, email: editEmail })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal memperbarui profil');

      setUserData(data.user);
      alert('Data diri berhasil diperbarui!');
      setView('detail_profil');
    } catch (err) {
      alert('Gagal update profil: ' + err.message);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const currentToken = localStorage.getItem('token');
    if (!currentToken) { setView('login'); return; }

    try {
      const res = await fetch('http://localhost:5000/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentToken}` },
        body: JSON.stringify({ passwordLama, passwordBaru })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengganti password');

      alert('Password berhasil diperbarui! Silakan gunakan password baru Anda.');
      setPasswordLama('');
      setPasswordBaru('');
      setView('dashboard');
      setActiveTab('profil');
    } catch (err) {
      alert('Gagal ganti password: ' + err.message);
    }
  };

  const handleTambahTanaman = async (e) => {
    e.preventDefault();
    const currentToken = localStorage.getItem('token');
    if (!currentToken) { setView('login'); return; }

    try {
      const payload = {
        namaTanaman,
        varietas: varietas || '-',
        jumlahBibit: String(jumlahBibit),
        lokasi: lokasi || 'Pekarangan',
        modalAwal: parseFloat(modalAwal) || 0,
        tanggalTanam: tanggalTanamInput ? new Date(tanggalTanamInput).toISOString() : new Date().toISOString()
      };

      const res = await fetch('http://localhost:5000/api/tanaman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentToken}` },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menyimpan tanaman');

      if (parseFloat(modalAwal) > 0) {
        await fetch('http://localhost:5000/api/keuangan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentToken}` },
          body: JSON.stringify({
            kategori: 'Modal Tanam',
            nominal: parseFloat(modalAwal),
            tipe: 'PENGELUARAN',
            keterangan: `Modal awal penanaman ${namaTanaman}`,
            tanggal: tanggalTanamInput ? new Date(tanggalTanamInput).toISOString() : new Date().toISOString()
          })
        });
      }

      alert('Tanaman berhasil disimpan!');
      setNamaTanaman(''); setVarietas(''); setJumlahBibit(''); setLokasi(''); setModalAwal('');
      setTanggalTanamInput(new Date().toISOString().split('T')[0]);
      await fetchDataDashboard();
      setView('dashboard');
      setActiveTab('tanaman');
    } catch (err) {
      alert('Gagal menyimpan tanaman: ' + err.message);
    }
  };

  const handlePanenSubmit = async (e) => {
    e.preventDefault();
    const currentToken = localStorage.getItem('token');
    if (!currentToken) { setView('login'); return; }

    try {
      const res = await fetch(`http://localhost:5000/api/tanaman/${selectedTanaman.id}/panen`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentToken}` },
        body: JSON.stringify({
          hargaJual: parseFloat(hargaJual) || 0,
          jumlahHasil: jumlahHasil || '1 Kg',
          catatanPanen,
          tanggalPanen: tanggalPanenInput ? new Date(tanggalPanenInput).toISOString() : new Date().toISOString()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal memproses panen');

      alert(data.message);
      setHargaJual(''); setJumlahHasil(''); setCatatanPanen(''); setSelectedTanaman(null);
      setTanggalPanenInput(new Date().toISOString().split('T')[0]);
      await fetchDataDashboard();
      setView('dashboard');
      setActiveTab('tanaman');
    } catch (err) {
      alert('Gagal panen: ' + err.message);
    }
  };

  const handleKeuanganSubmit = async (tipeTrx) => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) { setView('login'); return; }

    try {
      const res = await fetch('http://localhost:5000/api/keuangan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentToken}` },
        body: JSON.stringify({
          kategori: kategoriKeuangan,
          nominal: parseFloat(nominalKeuangan) || 0,
          tipe: tipeTrx,
          keterangan: keteranganKeuangan,
          tanggal: tanggalKeuanganInput ? new Date(tanggalKeuanganInput).toISOString() : new Date().toISOString()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menyimpan transaksi keuangan');

      alert('Catatan keuangan berhasil disimpan!');
      setNominalKeuangan(''); setKeteranganKeuangan('');
      setTanggalKeuanganInput(new Date().toISOString().split('T')[0]);
      await fetchDataDashboard();
      setView('dashboard');
      setActiveTab('keuangan');
    } catch (err) {
      alert('Gagal menyimpan: ' + err.message);
    }
  };

  const handleKeuanganUpdate = async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) { setView('login'); return; }

    try {
      const res = await fetch(`http://localhost:5000/api/keuangan/${selectedTrxId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentToken}` },
        body: JSON.stringify({
          kategori: kategoriKeuangan,
          nominal: parseFloat(nominalKeuangan) || 0,
          tipe: tipeKeuangan,
          keterangan: keteranganKeuangan,
          tanggal: tanggalKeuanganInput ? new Date(tanggalKeuanganInput).toISOString() : new Date().toISOString()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal memperbarui transaksi');

      alert('Transaksi keuangan berhasil diperbarui!');
      setSelectedTrxId(null); setNominalKeuangan(''); setKeteranganKeuangan('');
      await fetchDataDashboard();
      setView('dashboard');
      setActiveTab('keuangan');
    } catch (err) {
      alert('Gagal update: ' + err.message);
    }
  };

  const handleKeuanganDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus catatan keuangan ini?')) return;
    const currentToken = localStorage.getItem('token');
    if (!currentToken) { setView('login'); return; }

    try {
      const res = await fetch(`http://localhost:5000/api/keuangan/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });

      const textResponse = await res.text();
      let data = {};
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (e) {
        throw new Error("Respon server bukan format JSON: " + textResponse);
      }

      if (!res.ok) throw new Error(data.message || 'Gagal menghapus transaksi');

      alert('Transaksi berhasil dihapus!');
      await fetchDataDashboard();
    } catch (err) {
      alert('Gagal hapus: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserData(null);
    setView('landing');
  };

  const totalDitanam = tanamanList.length;
  const belumPanen = tanamanList.filter(t => t.status !== 'PANEN').length;
  const sudahPanen = tanamanList.filter(t => t.status === 'PANEN').length;

  const filteredTanamanList = tanamanList.filter(t => {
    if (filterStatus === 'Semua') return true;
    if (filterStatus === 'Ditanam') return t.status !== 'PANEN';
    if (filterStatus === 'Belum Panen') return t.status !== 'PANEN';
    if (filterStatus === 'Sudah Panen') return t.status === 'PANEN';
    return true;
  });

  return (
    <div 
      className="min-h-screen text-[#2C3531] font-sans antialiased flex flex-col justify-between max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-gray-100 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: getBackgroundImage() }}
    >
      <div className="relative z-10 flex flex-col flex-1 justify-between">
      
      {/* 1. LANDING PAGE */}
      {view === 'landing' && (
        <div className="flex-1 flex flex-col justify-between px-6 py-8 text-center relative overflow-hidden bg-gradient-to-b from-black/10 via-transparent to-black/50">
          <div className="w-full flex flex-col items-center pt-3 z-10">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/80 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgb(0,0,0,0.1)] border border-white/40 p-1.5">
                <img src="/logo_lumajang.png" alt="Logo Lumajang" className="w-full h-full object-contain" />
              </div>
              <div className="w-14 h-14 bg-white/80 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgb(0,0,0,0.1)] border border-white/40 p-1.5">
                <img src="/logo_pkk.png" alt="Logo PKK" className="w-full h-full object-contain" />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-1">
              <span className="text-4xl font-black tracking-tight text-[#1E3821] drop-shadow-sm">PESAT</span>
              <span className="text-4xl font-black tracking-tight text-[#D27D2D] drop-shadow-sm">GO!</span>
            </div>

            <div className="w-60 h-1 bg-gradient-to-r from-transparent via-[#D27D2D] to-transparent rounded-full mb-1"></div>
            <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-[#D27D2D] to-transparent rounded-full mb-4"></div>

            <p className="text-[9px] font-extrabold text-[#2F5233] tracking-widest uppercase bg-white/60 backdrop-blur-md px-4 py-1 rounded-full shadow-xs border border-white/30">
              Pekarangan Sehat, Produktif, & Menguntungkan
            </p>
          </div>

          <div className="w-full my-auto z-10 py-3">
            <div className="bg-white/40 backdrop-blur-xl p-4 rounded-[40px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] border border-white/30 grid grid-cols-4 gap-2 text-center">
              <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                <div className="w-11 h-11 bg-white/80 text-[#2F5233] rounded-2xl flex items-center justify-center mb-1.5 shadow-sm border border-white/50 group-hover:bg-[#2F5233] group-hover:text-white transition-colors">
                  <Sprout size={20} />
                </div>
                <span className="text-[10px] font-bold text-[#2C3531] leading-tight">Kelola Tanaman</span>
              </div>
              <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                <div className="w-11 h-11 bg-white/80 text-blue-700 rounded-2xl flex items-center justify-center mb-1.5 shadow-sm border border-white/50 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Wallet size={20} />
                </div>
                <span className="text-[10px] font-bold text-[#2C3531] leading-tight">Catat Keuangan</span>
              </div>
              <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                <div className="w-11 h-11 bg-white/80 text-[#D27D2D] rounded-2xl flex items-center justify-center mb-1.5 shadow-sm border border-white/50 group-hover:bg-[#D27D2D] group-hover:text-white transition-colors">
                  <Scissors size={20} />
                </div>
                <span className="text-[10px] font-bold text-[#2C3531] leading-tight">Pantau Panen</span>
              </div>
              <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                <div className="w-11 h-11 bg-white/80 text-emerald-700 rounded-2xl flex items-center justify-center mb-1.5 shadow-sm border border-white/50 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <CheckCircle2 size={20} />
                </div>
                <span className="text-[10px] font-bold text-[#2C3531] leading-tight">Pekarangan Produktif</span>
              </div>
            </div>
          </div>

          <div className="w-full space-y-3 pb-2 z-10">
            <button 
              onClick={() => setView('login')} 
              className="w-full bg-gradient-to-r from-[#2F5233] to-[#3B6640] hover:from-[#234026] hover:to-[#2F5233] text-white font-extrabold py-4 rounded-2xl shadow-[0_10px_25px_rgba(47,82,51,0.4)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 text-sm border border-white/20"
            >
              Mulai Sekarang <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 2. LOGIN */}
      {view === 'login' && (
        <div 
          className="min-h-screen flex flex-col items-center justify-center w-full bg-cover bg-center bg-no-repeat relative overflow-hidden max-w-md mx-auto p-5"
          style={{ backgroundImage: "url('/lainnya_3.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]"></div>

          <div className="absolute top-4 left-4 z-20">
            <button onClick={() => setView('landing')} className="w-9 h-9 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-md font-bold hover:bg-white transition">
              ←
            </button>
          </div>

          <div className="relative z-10 flex flex-col items-center mb-6 text-center">
            <h1 className="text-3xl font-black tracking-tight drop-shadow-md">
              <span className="text-[#2F5233]">PESAT</span> <span className="text-[#D27D2D]">GO!</span>
            </h1>
            <div className="w-12 h-1 bg-[#D27D2D] rounded-full mt-1.5 shadow-sm"></div>
          </div>

          <div className="relative z-10 w-full max-w-[340px] text-left bg-white/85 backdrop-blur-xl p-5 rounded-[24px] shadow-2xl border border-white/60 space-y-3">
            <div className="text-center mb-2">
              <h2 className="text-base font-black text-[#2F5233] tracking-tight">Selamat Datang! ✨</h2>
              <p className="text-[11px] text-gray-600 font-medium mt-0.5">Masuk untuk melanjutkan ke akun PESAT GO!</p>
            </div>

            {errorMessage && <p className="text-[11px] bg-red-500/90 text-white p-2 rounded-xl mb-2 font-semibold text-center shadow">{errorMessage}</p>}
            
            <form onSubmit={handleLogin} className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Email atau Username</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-gray-400"><Mail size={15} /></span>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Password</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-gray-400"><Lock size={15} /></span>
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer text-[#2F5233] font-bold">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded text-[#2F5233] focus:ring-[#2F5233]" />
                  Ingat Saya
                </label>
                <a href="#lupa" onClick={(e) => { e.preventDefault(); alert('Silakan hubungi administrator.'); }} className="text-[#2F5233] font-bold hover:underline">Lupa Password?</a>
              </div>

              <button type="submit" className="w-full bg-[#2F5233] hover:bg-[#234026] text-white font-extrabold py-3 rounded-xl shadow-lg transition-all transform active:scale-95 text-xs flex items-center justify-center gap-1.5 mt-2">
                Masuk
              </button>
            </form>

            <p className="text-center text-[11px] text-gray-700 font-medium pt-1">
              Belum punya akun? <button onClick={() => setView('register')} className="text-[#2F5233] font-bold hover:underline">Daftar Sekarang</button>
            </p>
          </div>
        </div>
      )}

      {/* 3. REGISTER */}
      {view === 'register' && (
        <div 
          className="min-h-screen flex flex-col items-center justify-center w-full bg-cover bg-center bg-no-repeat relative overflow-hidden max-w-md mx-auto p-5"
          style={{ backgroundImage: "url('/lainnya_3.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]"></div>

          <div className="absolute top-4 left-4 z-20">
            <button onClick={() => setView('landing')} className="w-9 h-9 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-md font-bold hover:bg-white transition">
              ←
            </button>
          </div>

          <div className="relative z-10 flex flex-col items-center mb-6 text-center">
            <h1 className="text-3xl font-black tracking-tight drop-shadow-md">
              <span className="text-[#2F5233]">PESAT</span> <span className="text-[#D27D2D]">GO!</span>
            </h1>
            <div className="w-12 h-1 bg-[#D27D2D] rounded-full mt-1.5 shadow-sm"></div>
          </div>

          <div className="relative z-10 w-full max-w-[340px] text-left bg-white/85 backdrop-blur-xl p-5 rounded-[24px] shadow-2xl border border-white/60 space-y-3">
            <div className="text-center mb-2">
              <h2 className="text-base font-black text-[#2F5233] tracking-tight">Buat Akun Baru ✨</h2>
              <p className="text-[11px] text-gray-600 font-medium mt-0.5">Daftar untuk mulai mengelola pekarangan Anda</p>
            </div>

            {errorMessage && <p className="text-[11px] bg-red-500/90 text-white p-2 rounded-xl mb-2 font-semibold text-center shadow">{errorMessage}</p>}
            
            <form onSubmit={handleRegister} className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Nama Lengkap</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-gray-400"><User size={15} /></span>
                  <input type="text" required value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama Lengkap" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Email</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-gray-400"><Mail size={15} /></span>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Password</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-gray-400"><Lock size={15} /></span>
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#2F5233] hover:bg-[#234026] text-white font-extrabold py-3 rounded-xl shadow-lg transition-all transform active:scale-95 text-xs flex items-center justify-center gap-1.5 mt-2">
                Daftar Sekarang
              </button>
            </form>

            <p className="text-center text-[11px] text-gray-700 font-medium pt-1">
              Sudah punya akun? <button onClick={() => setView('login')} className="text-[#2F5233] font-bold hover:underline">Masuk</button>
            </p>
          </div>
        </div>
      )}

      {/* 4. DASHBOARD UTAMA */}
      {view === 'dashboard' && (
        <div className="flex-1 flex flex-col pb-24 overflow-y-auto">
          <div className="px-6 pt-6 pb-4 bg-white/80 backdrop-blur-md flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2F5233] text-white rounded-xl flex items-center justify-center">
                <Sprout size={18} />
              </div>
              <span className="font-extrabold text-lg text-[#2F5233] tracking-tight">PESAT GO!</span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Tab Beranda */}
            {activeTab === 'beranda' && (
              <div className="space-y-6">
                <div className="text-center pt-2">
                  <h1 className="text-3xl font-black tracking-tight mb-1">
                    <span className="text-[#2F5233] drop-shadow-sm">PESAT</span> <span className="text-[#D27D2D] drop-shadow-sm">GO!</span>
                  </h1>
                  <div className="w-16 h-1 bg-[#D27D2D] rounded-full mx-auto mb-4 shadow-sm"></div>
                  
                  <div className="px-2">
                    <h2 className="text-xl font-black text-[#1E3821] drop-shadow-md mb-0.5">Halo, {userData?.nama || 'Pekarang'}! 👋</h2>
                    <p className="text-xs text-[#2F5233] font-bold drop-shadow">Selamat datang di pekarangan produktif Anda.</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 px-1">
                  <div className="text-center bg-white/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/40 shadow-sm">
                    <div className="text-[#2F5233] flex justify-center mb-1"><Sprout size={20} /></div>
                    <h4 className="text-2xl font-black text-[#2F5233]">{totalDitanam}</h4>
                    <p className="text-[11px] text-[#1E3821] font-extrabold mt-0.5">Ditanam</p>
                  </div>
                  <div className="text-center bg-white/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/40 shadow-sm">
                    <div className="text-[#D27D2D] flex justify-center mb-1"><Scissors size={20} /></div>
                    <h4 className="text-2xl font-black text-[#D27D2D]">{belumPanen}</h4>
                    <p className="text-[11px] text-[#1E3821] font-extrabold mt-0.5">Belum Panen</p>
                  </div>
                  <div className="text-center bg-white/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/40 shadow-sm">
                    <div className="text-emerald-700 flex justify-center mb-1"><CheckCircle2 size={20} /></div>
                    <h4 className="text-2xl font-black text-emerald-700">{sudahPanen}</h4>
                    <p className="text-[11px] text-[#1E3821] font-extrabold mt-0.5">Sudah Panen</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#2F5233] to-[#3B6640] text-white p-5 rounded-3xl shadow-xl relative overflow-hidden border border-white/20">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs text-white/80 font-medium">Dompet Pekarangan</p>
                      <p className="text-xs font-bold text-yellow-300">Cuan Bersih</p>
                    </div>
                    <Wallet size={24} className="text-yellow-400" />
                  </div>
                  <h2 className="text-3xl font-extrabold mb-1">Rp {keuanganData.cuanBersih.toLocaleString('id-ID')}</h2>
                  <div className="flex items-center gap-1 text-[11px] text-green-200 font-medium mt-1">
                    <span>↑ Total Pemasukan: Rp {keuanganData.totalPemasukan.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold uppercase text-[#2F5233] tracking-wider mb-3 px-1 drop-shadow-sm">Aksi Cepat</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <button onClick={() => setView('tambah_tanaman')} className="bg-white/50 backdrop-blur-md hover:bg-white/70 border border-white/50 p-3.5 rounded-2xl flex flex-col items-center text-center shadow-sm transition">
                      <div className="w-11 h-11 bg-green-100 text-[#2F5233] rounded-xl flex items-center justify-center mb-2 shadow-xs">
                        <PlusCircle size={22} />
                      </div>
                      <span className="text-xs font-extrabold text-[#2F5233]">+ Tanam</span>
                    </button>
                    <button onClick={() => { if(tanamanList.length > 0) { setSelectedTanaman(tanamanList[0]); setView('panen_tanaman'); } else { alert('Belum ada tanaman untuk dipanen!'); }}} className="bg-white/50 backdrop-blur-md hover:bg-white/70 border border-white/50 p-3.5 rounded-2xl flex flex-col items-center text-center shadow-sm transition">
                      <div className="w-11 h-11 bg-orange-100 text-[#D27D2D] rounded-xl flex items-center justify-center mb-2 shadow-xs">
                        <Scissors size={22} />
                      </div>
                      <span className="text-xs font-extrabold text-[#D27D2D]">+ Panen</span>
                    </button>
                    <button onClick={() => { setActiveTab('keuangan'); setView('tambah_pengeluaran'); }} className="bg-white/50 backdrop-blur-md hover:bg-white/70 border border-white/50 p-3.5 rounded-2xl flex flex-col items-center text-center shadow-sm transition">
                      <div className="w-11 h-11 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-2 shadow-xs">
                        <Wallet size={22} />
                      </div>
                      <span className="text-xs font-extrabold text-blue-700">+ Catat</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Tanaman */}
            {activeTab === 'tanaman' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg text-[#1E3821] drop-shadow-sm">Tanaman Saya</h4>
                  <button onClick={() => setView('tambah_tanaman')} className="text-xs bg-[#2F5233] hover:bg-[#234026] text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-md transition">+ Register Tanaman Baru</button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
                  {['Semua', 'Ditanam', 'Belum Panen', 'Sudah Panen'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                        filterStatus === status 
                          ? 'bg-[#2F5233] text-white shadow-md' 
                          : 'bg-white/40 backdrop-blur-md text-[#1E3821] font-bold border border-white/50 hover:bg-white/60'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {filteredTanamanList.length === 0 ? (
                    <p className="text-xs text-[#1E3821] font-bold bg-white/40 backdrop-blur-md p-6 rounded-2xl text-center border border-white/50 shadow-sm">Tidak ada data tanaman untuk filter ini.</p>
                  ) : (
                    filteredTanamanList.map((t) => (
                      <div 
                        key={t.id} 
                        onClick={() => { setSelectedTanaman(t); setView('detail_tanaman'); }}
                        className="bg-white/45 backdrop-blur-md p-4 rounded-2xl border border-white/60 flex justify-between items-center shadow-sm cursor-pointer hover:bg-white/60 transition"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 bg-white/70 rounded-xl flex items-center justify-center text-[#2F5233] font-bold text-lg shrink-0 overflow-hidden border border-white/80 shadow-xs">
                            🌱
                          </div>
                          <div>
                            <p className="font-extrabold text-[#1E3821] text-base drop-shadow-xs">{t.namaTanaman}</p>
                            <p className="text-xs text-[#2F5233] font-bold mt-0.5 flex items-center gap-1">
                              <Calendar size={12} /> Tanam: {t.tanggalTanam ? new Date(t.tanggalTanam).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'} • Bibit: {t.jumlahBibit}
                            </p>
                            <div className="mt-1.5">
                              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-block ${t.status === 'PANEN' ? 'bg-[#D27D2D]/20 text-[#D27D2D]' : 'bg-[#2F5233]/20 text-[#2F5233]'}`}>
                                {t.status === 'PANEN' ? 'Sudah Panen' : 'Ditanam'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-[#2F5233]" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab Keuangan */}
            {activeTab === 'keuangan' && (
              <div className="space-y-5">

                {/* Saldo Bersih Card */}
                <div className="bg-gradient-to-r from-[#2F5233] to-[#3B6640] text-white p-5 rounded-3xl shadow-lg relative overflow-hidden border border-white/20">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-white/80 font-medium">Saldo Bersih</p>
                    <Wallet size={20} className="text-yellow-400" />
                  </div>
                  <h2 className="text-3xl font-extrabold mb-1">Rp {keuanganData.cuanBersih.toLocaleString('id-ID')}</h2>
                  <div className="flex items-center gap-1 text-[11px] text-green-300 font-medium">
                    <span>↑ Total Pemasukan: Rp {keuanganData.totalPemasukan.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Sub Tab Keuangan */}
                <div className="flex bg-white/40 backdrop-blur-md p-1 rounded-2xl border border-white/60 shadow-sm">
                  <button onClick={() => setSubTabKeuangan('ringkasan')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${subTabKeuangan === 'ringkasan' ? 'bg-[#2F5233] text-white shadow-sm' : 'text-[#1E3821] hover:bg-white/40'}`}>Ringkasan</button>
                  <button onClick={() => setSubTabKeuangan('pengeluaran')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${subTabKeuangan === 'pengeluaran' ? 'bg-[#2F5233] text-white shadow-sm' : 'text-[#1E3821] hover:bg-white/40'}`}>Pengeluaran</button>
                  <button onClick={() => setSubTabKeuangan('pemasukan')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${subTabKeuangan === 'pemasukan' ? 'bg-[#2F5233] text-white shadow-sm' : 'text-[#1E3821] hover:bg-white/40'}`}>Pemasukan</button>
                </div>

                {/* Ringkasan Grafik */}
                {subTabKeuangan === 'ringkasan' && (
                  <div className="bg-white/45 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#1E3821] font-bold px-2">
                      <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#2F5233] rounded-sm inline-block"></span> Pemasukan</div>
                      <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-orange-400 rounded-sm inline-block"></span> Pengeluaran</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/50 text-center">
                      <div className="bg-white/40 p-2 rounded-xl border border-white/50">
                        <div className="flex justify-center items-end gap-1 h-16 mb-1">
                          <div className="w-3 bg-[#2F5233] rounded-t-sm h-12"></div>
                          <div className="w-3 bg-orange-400 rounded-t-sm h-8"></div>
                        </div>
                        <span className="text-xs font-bold text-[#1E3821]">Okt</span>
                      </div>
                      <div className="bg-white/40 p-2 rounded-xl border border-white/50">
                        <div className="flex justify-center items-end gap-1 h-16 mb-1">
                          <div className="w-3 bg-[#2F5233] rounded-t-sm h-14"></div>
                          <div className="w-3 bg-orange-400 rounded-t-sm h-9"></div>
                        </div>
                        <span className="text-xs font-bold text-[#1E3821]">Nov</span>
                      </div>
                      <div className="bg-white/40 p-2 rounded-xl border border-white/50">
                        <div className="flex justify-center items-end gap-1 h-16 mb-1">
                          <div className="w-3 bg-[#2F5233] rounded-t-sm h-10"></div>
                          <div className="w-3 bg-orange-400 rounded-t-sm h-7"></div>
                        </div>
                        <span className="text-xs font-bold text-[#1E3821]">Des</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tombol Aksi Transaksi */}
                <div className="flex gap-3">
                  <button onClick={() => setView('tambah_pengeluaran')} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-2xl shadow-md text-xs flex items-center justify-center gap-1.5 transition">
                    <TrendingDown size={16} /> + Pengeluaran
                  </button>
                  <button onClick={() => setView('tambah_pemasukan')} className="flex-1 bg-[#2F5233] hover:bg-[#234026] text-white font-bold py-3.5 rounded-2xl shadow-md text-xs flex items-center justify-center gap-1.5 transition">
                    <TrendingUp size={16} /> + Pemasukan
                  </button>
                </div>

                {/* Daftar Transaksi */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <h5 className="text-xs font-extrabold uppercase text-[#1E3821] tracking-wider drop-shadow-sm">
                      {subTabKeuangan === 'ringkasan' ? 'Transaksi Terbaru (3 Teratas)' : `Daftar ${subTabKeuangan.charAt(0).toUpperCase() + subTabKeuangan.slice(1)}`}
                    </h5>
                    {subTabKeuangan === 'ringkasan' && keuanganData.transaksi.length > 3 && (
                      <span className="text-[10px] text-[#2F5233] font-bold">Menampilkan 3 dari {keuanganData.transaksi.length}</span>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {(() => {
                      const filteredTrx = keuanganData.transaksi.filter(trx => {
                        if (subTabKeuangan === 'pengeluaran') return trx.tipe === 'PENGELUARAN';
                        if (subTabKeuangan === 'pemasukan') return trx.tipe === 'PEMASUKAN';
                        return true;
                      });

                      // Batasi hanya 3 transaksi jika berada di sub-tab ringkasan
                      const displayedTrx = subTabKeuangan === 'ringkasan' ? filteredTrx.slice(0, 3) : filteredTrx;

                      if (displayedTrx.length === 0) {
                        return (
                          <p className="text-xs text-[#1E3821] font-bold bg-white/40 backdrop-blur-md p-6 rounded-2xl text-center border border-white/50 shadow-sm">
                            Belum ada catatan transaksi keuangan.
                          </p>
                        );
                      }

                      return displayedTrx.map((trx) => (
                        <div key={trx.id} className="bg-white/45 backdrop-blur-md p-4 rounded-2xl border border-white/60 flex justify-between items-center text-sm shadow-sm hover:bg-white/60 transition">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs ${trx.tipe === 'PEMASUKAN' ? 'bg-[#2F5233]' : 'bg-orange-400'}`}>
                              {trx.tipe === 'PEMASUKAN' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                            </div>
                            <div>
                              <p className="font-extrabold text-[#1E3821] text-sm drop-shadow-xs">{trx.kategori}</p>
                              <p className="text-xs text-[#2F5233] font-semibold mt-0.5">{trx.keterangan || '-'}</p>
                              <p className="text-[10px] text-[#2F5233] font-medium mt-0.5">
                                📅 {trx.tanggal ? new Date(trx.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className={`font-extrabold text-sm text-right ${trx.tipe === 'PEMASUKAN' ? 'text-[#2F5233]' : 'text-orange-600'}`}>
                              {trx.tipe === 'PEMASUKAN' ? '+' : '-'} Rp {parseFloat(trx.nominal).toLocaleString('id-ID')}
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => {
                                  setSelectedTrxId(trx.id);
                                  setKategoriKeuangan(trx.kategori);
                                  setNominalKeuangan(trx.nominal);
                                  setKeteranganKeuangan(trx.keterangan || '');
                                  setTipeKeuangan(trx.tipe);
                                  setTanggalKeuanganInput(trx.tanggal ? trx.tanggal.split('T')[0] : new Date().toISOString().split('T')[0]);
                                  setView('edit_keuangan');
                                }}
                                className="p-1.5 bg-white/70 text-blue-700 rounded-lg hover:bg-white transition shadow-xs border border-white/80"
                                title="Edit Transaksi"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button 
                                onClick={() => handleKeuanganDelete(trx.id)}
                                className="p-1.5 bg-white/70 text-red-600 rounded-lg hover:bg-white transition shadow-xs border border-white/80"
                                title="Hapus Transaksi"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}

           {/* Tab Profil */}
            {activeTab === 'profil' && (
              <div className="space-y-4">
                <div className="bg-white/45 backdrop-blur-md p-6 rounded-3xl border border-white/60 text-center space-y-3 shadow-sm relative">
                  <div className="w-24 h-24 bg-white/80 text-[#2F5233] rounded-full flex items-center justify-center font-bold text-3xl mx-auto shadow-inner relative border border-white/80">
                    👤
                    <div className="absolute bottom-0 right-0 bg-[#2F5233] text-white p-1.5 rounded-full shadow border-2 border-white">
                      <Camera size={14} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl text-[#1E3821] drop-shadow-sm">{userData?.nama || 'Pengguna PESAT GO!'}</h3>
                    <p className="text-xs text-[#2F5233] font-bold mt-0.5 drop-shadow-sm">{userData?.email || 'user@email.com'}</p>
                  </div>
                </div>

                <div className="bg-white/45 backdrop-blur-md rounded-3xl border border-white/60 overflow-hidden shadow-sm divide-y divide-white/50">
                  <button onClick={() => setView('detail_profil')} className="w-full p-4 flex items-center justify-between hover:bg-white/60 transition text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white/70 text-[#2F5233] rounded-xl flex items-center justify-center border border-white/80 shadow-xs">
                        <User size={18} />
                      </div>
                      <span className="font-bold text-sm text-[#1E3821]">Data Diri</span>
                    </div>
                    <ChevronRight size={18} className="text-[#2F5233]" />
                  </button>

                  <button onClick={() => setView('ganti_password')} className="w-full p-4 flex items-center justify-between hover:bg-white/60 transition text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white/70 text-[#2F5233] rounded-xl flex items-center justify-center border border-white/80 shadow-xs">
                        <KeyRound size={18} />
                      </div>
                      <span className="font-bold text-sm text-[#1E3821]">Ganti Password</span>
                    </div>
                    <ChevronRight size={18} className="text-[#2F5233]" />
                  </button>

                  <button onClick={handleLogout} className="w-full p-4 flex items-center justify-between hover:bg-red-500/10 transition text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white/70 text-red-600 rounded-xl flex items-center justify-center border border-white/80 shadow-xs">
                        <LogOut size={18} />
                      </div>
                      <span className="font-bold text-sm text-red-600">Keluar</span>
                    </div>
                    <ChevronRight size={18} className="text-red-400" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-3 flex justify-around items-center shadow-lg">
            <button onClick={() => setActiveTab('beranda')} className={`flex flex-col items-center gap-1 ${activeTab === 'beranda' ? 'text-[#2F5233] font-bold' : 'text-gray-400 font-medium'}`}>
              <Home size={20} />
              <span className="text-[10px]">Beranda</span>
            </button>
            <button onClick={() => setActiveTab('tanaman')} className={`flex flex-col items-center gap-1 ${activeTab === 'tanaman' ? 'text-[#2F5233] font-bold' : 'text-gray-400 font-medium'}`}>
              <Sprout size={20} />
              <span className="text-[10px]">Tanaman</span>
            </button>
            <button onClick={() => setActiveTab('keuangan')} className={`flex flex-col items-center gap-1 ${activeTab === 'keuangan' ? 'text-[#2F5233] font-bold' : 'text-gray-400 font-medium'}`}>
              <Wallet size={20} />
              <span className="text-[10px]">Keuangan</span>
            </button>
            <button onClick={() => setActiveTab('profil')} className={`flex flex-col items-center gap-1 ${activeTab === 'profil' ? 'text-[#2F5233] font-bold' : 'text-gray-400 font-medium'}`}>
              <User size={20} />
              <span className="text-[10px]">Profil</span>
            </button>
          </div>
        </div>
      )}

      {/* FORM TAMBAH / REGISTER TANAMAN BARU */}
      {view === 'tambah_tanaman' && (
        <div 
          className="min-h-screen flex flex-col items-center justify-center w-full bg-cover bg-center bg-no-repeat relative overflow-hidden max-w-md mx-auto p-5"
          style={{ backgroundImage: "url('/lainnya_3.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]"></div>

          <div className="absolute top-4 left-4 z-20">
            <button onClick={() => { setView('dashboard'); setActiveTab('tanaman'); }} className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-md font-bold hover:bg-white transition">
              ←
            </button>
          </div>

          <div className="relative z-10 flex flex-col items-center mb-3 text-center">
            <h1 className="text-2xl font-black tracking-tight drop-shadow-md">
              <span className="text-[#2F5233]">PESAT</span> <span className="text-[#D27D2D]">GO!</span>
            </h1>
            <div className="w-12 h-1 bg-[#D27D2D] rounded-full mt-1 shadow-sm"></div>
          </div>

          <div className="relative z-10 w-full max-w-[340px] text-left bg-white/85 backdrop-blur-xl p-5 rounded-[24px] shadow-2xl border border-white/60 space-y-3 max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-2">
              <h2 className="text-base font-black text-[#2F5233] tracking-tight">Register Tanaman Baru 🌱</h2>
              <p className="text-[11px] text-gray-600 font-medium mt-0.5">Isi data tanaman pekarangan Anda</p>
            </div>

            <form onSubmit={handleTambahTanaman} className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Nama Tanaman</label>
                <input type="text" required value={namaTanaman} onChange={e => setNamaTanaman(e.target.value)} placeholder="Contoh: Selada" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Tanggal Tanam</label>
                <input type="date" required value={tanggalTanamInput} onChange={e => setTanggalTanamInput(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Varietas</label>
                <input type="text" value={varietas} onChange={e => setVarietas(e.target.value)} placeholder="Contoh: Hijau Segar" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Jumlah Bibit</label>
                  <input type="text" required value={jumlahBibit} onChange={e => setJumlahBibit(e.target.value)} placeholder="10 Pot" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Modal Awal (Rp)</label>
                  <input type="number" required value={modalAwal} onChange={e => setModalAwal(e.target.value)} placeholder="25000" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Lokasi Tanam</label>
                <input type="text" required value={lokasi} onChange={e => setLokasi(e.target.value)} placeholder="Pekarangan Depan" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <button type="submit" className="w-full bg-[#2F5233] hover:bg-[#234026] text-white font-extrabold py-3 rounded-xl shadow-lg transition-all transform active:scale-95 text-xs flex items-center justify-center gap-1.5 mt-2">
                Simpan Tanaman
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL TANAMAN */}
      {view === 'detail_tanaman' && selectedTanaman && (
        <div 
          className="min-h-screen flex flex-col items-center justify-center w-full bg-cover bg-center bg-no-repeat relative overflow-hidden max-w-md mx-auto p-5"
          style={{ backgroundImage: "url('/lainnya_3.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]"></div>

          <div className="absolute top-4 left-4 z-20">
            <button onClick={() => { setView('dashboard'); setActiveTab('tanaman'); }} className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-md font-bold hover:bg-white transition">
              ←
            </button>
          </div>

          <div className="relative z-10 w-full max-w-[340px] text-left bg-white/85 backdrop-blur-xl p-6 rounded-[24px] shadow-2xl border border-white/60 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 text-[#2F5233] rounded-2xl flex items-center justify-center text-2xl shadow-inner">🥬</div>
                <div>
                  <h2 className="text-xl font-black text-[#2F5233]">{selectedTanaman.namaTanaman}</h2>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${selectedTanaman.status === 'PANEN' ? 'bg-[#D27D2D]/20 text-[#D27D2D]' : 'bg-[#2F5233]/20 text-[#2F5233]'}`}>
                    {selectedTanaman.status === 'PANEN' ? 'Sudah Panen' : 'Ditanam'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs bg-white/60 p-4 rounded-2xl border border-white/80 shadow-inner">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Tanggal Tanam</span>
                <span className="font-bold text-[#2C3531]">
                  {selectedTanaman.tanggalTanam ? new Date(selectedTanaman.tanggalTanam).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Jumlah Bibit</span>
                <span className="font-bold text-[#2C3531]">{selectedTanaman.jumlahBibit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Modal Awal</span>
                <span className="font-bold text-[#2C3531]">Rp {parseFloat(selectedTanaman.modalAwal).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Lokasi</span>
                <span className="font-bold text-[#2C3531]">{selectedTanaman.lokasi}</span>
              </div>
            </div>

            {selectedTanaman.status !== 'PANEN' && (
              <button 
                onClick={() => setView('panen_tanaman')} 
                className="w-full bg-[#2F5233] hover:bg-[#234026] text-white font-extrabold py-3 rounded-xl shadow-lg transition-all transform active:scale-95 text-xs flex items-center justify-center gap-1.5"
              >
                <Scissors size={16} /> + Catat Panen
              </button>
            )}

            <button onClick={() => { setView('dashboard'); setActiveTab('tanaman'); }} className="w-full bg-white/80 hover:bg-white text-gray-700 font-bold py-2.5 rounded-xl text-xs transition border border-gray-200 shadow-sm">
              Kembali
            </button>
          </div>
        </div>
      )}

      {/* FORM PROSES PANEN */}
      {view === 'panen_tanaman' && selectedTanaman && (
        <div 
          className="min-h-screen flex flex-col items-center justify-center w-full bg-cover bg-center bg-no-repeat relative overflow-hidden max-w-md mx-auto p-5"
          style={{ backgroundImage: "url('/lainnya_3.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]"></div>

          <div className="absolute top-4 left-4 z-20">
            <button onClick={() => setView('detail_tanaman')} className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-md font-bold hover:bg-white transition">
              ←
            </button>
          </div>

          <div className="relative z-10 w-full max-w-[340px] text-left bg-white/85 backdrop-blur-xl p-5 rounded-[24px] shadow-2xl border border-white/60 space-y-3 max-h-[85vh] overflow-y-auto">
            <div className="text-center mb-2">
              <h2 className="text-base font-black text-[#2F5233] tracking-tight">Catat Panen 🌾</h2>
              <p className="text-[11px] text-gray-600 font-medium">Proses hasil panen tanaman Anda</p>
            </div>
            
            <form onSubmit={handlePanenSubmit} className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Pilih Tanaman</label>
                <input type="text" disabled value={selectedTanaman.namaTanaman} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-100/90 text-xs font-bold text-gray-700 shadow-inner" />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Tanggal Panen</label>
                <input type="date" required value={tanggalPanenInput} onChange={e => setTanggalPanenInput(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Jumlah Hasil Panen (Fisik)</label>
                <input type="text" required value={jumlahHasil} onChange={e => setJumlahHasil(e.target.value)} placeholder="Contoh: 2 Kg" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Hasil Penjualan / Pendapatan (Rp)</label>
                <input type="number" required value={hargaJual} onChange={e => setHargaJual(e.target.value)} placeholder="Contoh: 150000" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Catatan Panen</label>
                <textarea value={catatanPanen} onChange={e => setCatatanPanen(e.target.value)} placeholder="Contoh: Panen perdana, hasil bagus" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner h-20 resize-none" />
              </div>
              <button type="submit" className="w-full bg-[#2F5233] hover:bg-[#234026] text-white font-extrabold py-3 rounded-xl shadow-lg transition-all transform active:scale-95 text-xs flex items-center justify-center gap-1.5 mt-2">
                Simpan Panen
              </button>
            </form>
          </div>
        </div>
      )}

        {/* FORM CATAT PENGELUARAN */}
      {view === 'tambah_pengeluaran' && (
        <div 
          className="min-h-screen flex flex-col items-center justify-center w-full bg-cover bg-center bg-no-repeat relative overflow-hidden max-w-md mx-auto p-5"
          style={{ backgroundImage: "url('/lainnya_3.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]"></div>

          <div className="absolute top-4 left-4 z-20">
            <button onClick={() => { setView('dashboard'); setActiveTab('keuangan'); }} className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-md font-bold hover:bg-white transition">
              ←
            </button>
          </div>

          <div className="relative z-10 flex flex-col items-center mb-3 text-center">
            <h1 className="text-2xl font-black tracking-tight drop-shadow-md">
              <span className="text-[#2F5233]">PESAT</span> <span className="text-[#D27D2D]">GO!</span>
            </h1>
            <div className="w-12 h-1 bg-[#D27D2D] rounded-full mt-1 shadow-sm"></div>
          </div>

          <div className="relative z-10 w-full max-w-[340px] text-left bg-white/85 backdrop-blur-xl p-5 rounded-[24px] shadow-2xl border border-white/60 space-y-3 max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-2">
              <h2 className="text-base font-black text-[#2F5233] tracking-tight">Catat Pengeluaran 📦</h2>
              <p className="text-[11px] text-gray-600 font-medium mt-0.5">Catat rincian biaya pekarangan Anda</p>
            </div>
            
            <div className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Kategori</label>
                <select value={kategoriKeuangan} onChange={e => setKategoriKeuangan(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner">
                  <option value="Pupuk">Pupuk</option>
                  <option value="Bibit">Bibit</option>
                  <option value="Peralatan">Peralatan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Tanggal Pengeluaran</label>
                <input type="date" required value={tanggalKeuanganInput} onChange={e => setTanggalKeuanganInput(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Nominal (Rp)</label>
                <input type="number" required value={nominalKeuangan} onChange={e => setNominalKeuangan(e.target.value)} placeholder="Contoh: 25000" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Keterangan</label>
                <input type="text" value={keteranganKeuangan} onChange={e => setKeteranganKeuangan(e.target.value)} placeholder="Contoh: Pembelian pupuk organik" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <button onClick={() => handleKeuanganSubmit('PENGELUARAN')} className="w-full bg-[#2F5233] hover:bg-[#234026] text-white font-extrabold py-3 rounded-xl shadow-lg transition-all transform active:scale-95 text-xs flex items-center justify-center gap-1.5 mt-2">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM CATAT PEMASUKAN */}
      {view === 'tambah_pemasukan' && (
        <div 
          className="min-h-screen flex flex-col items-center justify-center w-full bg-cover bg-center bg-no-repeat relative overflow-hidden max-w-md mx-auto p-5"
          style={{ backgroundImage: "url('/lainnya_3.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]"></div>

          <div className="absolute top-4 left-4 z-20">
            <button onClick={() => { setView('dashboard'); setActiveTab('keuangan'); }} className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-md font-bold hover:bg-white transition">
              ←
            </button>
          </div>

          <div className="relative z-10 flex flex-col items-center mb-3 text-center">
            <h1 className="text-2xl font-black tracking-tight drop-shadow-md">
              <span className="text-[#2F5233]">PESAT</span> <span className="text-[#D27D2D]">GO!</span>
            </h1>
            <div className="w-12 h-1 bg-[#D27D2D] rounded-full mt-1 shadow-sm"></div>
          </div>

          <div className="relative z-10 w-full max-w-[340px] text-left bg-white/85 backdrop-blur-xl p-5 rounded-[24px] shadow-2xl border border-white/60 space-y-3 max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-2">
              <h2 className="text-base font-black text-[#2F5233] tracking-tight">Catat Pemasukan 💰</h2>
              <p className="text-[11px] text-gray-600 font-medium mt-0.5">Catat hasil panen atau pemasukan lainnya</p>
            </div>
            
            <div className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Asal Pemasukan</label>
                <select value={kategoriKeuangan} onChange={e => setKategoriKeuangan(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner">
                  <option value="Penjualan Panen">Penjualan Panen</option>
                  <option value="Subsidi">Subsidi</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Tanggal Pemasukan</label>
                <input type="date" required value={tanggalKeuanganInput} onChange={e => setTanggalKeuanganInput(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Nominal (Rp)</label>
                <input type="number" required value={nominalKeuangan} onChange={e => setNominalKeuangan(e.target.value)} placeholder="Contoh: 60000" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Keterangan</label>
                <input type="text" value={keteranganKeuangan} onChange={e => setKeteranganKeuangan(e.target.value)} placeholder="Contoh: Penjualan selada" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <button onClick={() => handleKeuanganSubmit('PEMASUKAN')} className="w-full bg-[#2F5233] hover:bg-[#234026] text-white font-extrabold py-3 rounded-xl shadow-lg transition-all transform active:scale-95 text-xs flex items-center justify-center gap-1.5 mt-2">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM EDIT KEUANGAN */}
      {view === 'edit_keuangan' && (
        <div 
          className="min-h-screen flex flex-col items-center justify-center w-full bg-cover bg-center bg-no-repeat relative overflow-hidden max-w-md mx-auto p-5"
          style={{ backgroundImage: "url('/lainnya_3.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]"></div>

          <div className="absolute top-4 left-4 z-20">
            <button onClick={() => { setView('dashboard'); setActiveTab('keuangan'); }} className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-md font-bold hover:bg-white transition">
              ←
            </button>
          </div>

          <div className="relative z-10 flex flex-col items-center mb-3 text-center">
            <h1 className="text-2xl font-black tracking-tight drop-shadow-md">
              <span className="text-[#2F5233]">PESAT</span> <span className="text-[#D27D2D]">GO!</span>
            </h1>
            <div className="w-12 h-1 bg-[#D27D2D] rounded-full mt-1 shadow-sm"></div>
          </div>

          <div className="relative z-10 w-full max-w-[340px] text-left bg-white/85 backdrop-blur-xl p-5 rounded-[24px] shadow-2xl border border-white/60 space-y-3 max-h-[85vh] overflow-y-auto">
            <div className="text-center mb-2">
              <h2 className="text-base font-black text-[#2F5233] tracking-tight">Edit Transaksi ✏️</h2>
              <p className="text-[11px] text-gray-600 font-medium mt-0.5">Perbarui rincian transaksi keuangan</p>
            </div>
            
            <div className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Tipe Transaksi</label>
                <select value={tipeKeuangan} onChange={e => setTipeKeuangan(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner">
                  <option value="PENGELUARAN">Pengeluaran</option>
                  <option value="PEMASUKAN">Pemasukan</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Kategori</label>
                <input type="text" required value={kategoriKeuangan} onChange={e => setKategoriKeuangan(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Tanggal Transaksi</label>
                <input type="date" required value={tanggalKeuanganInput} onChange={e => setTanggalKeuanganInput(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Nominal (Rp)</label>
                <input type="number" required value={nominalKeuangan} onChange={e => setNominalKeuangan(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Keterangan</label>
                <input type="text" value={keteranganKeuangan} onChange={e => setKeteranganKeuangan(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <button onClick={handleKeuanganUpdate} className="w-full bg-[#2F5233] hover:bg-[#234026] text-white font-extrabold py-3 rounded-xl shadow-lg transition-all transform active:scale-95 text-xs flex items-center justify-center gap-1.5 mt-2">
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL PROFIL / DATA DIRI */}
      {view === 'detail_profil' && (
        <div 
          className="min-h-screen flex flex-col items-center justify-center w-full bg-cover bg-center bg-no-repeat relative overflow-hidden max-w-md mx-auto p-5"
          style={{ backgroundImage: "url('/lainnya_3.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]"></div>

          <div className="absolute top-4 left-4 z-20">
            <button onClick={() => { setView('dashboard'); setActiveTab('profil'); }} className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-md font-bold hover:bg-white transition">
              ←
            </button>
          </div>

          <div className="relative z-10 w-full max-w-[340px] text-left bg-white/85 backdrop-blur-xl p-6 rounded-[24px] shadow-2xl border border-white/60 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-black text-[#2F5233] tracking-tight">Data Diri Akun 🆔</h2>
              <button 
                onClick={() => {
                  setEditNama(userData?.nama || '');
                  setEditEmail(userData?.email || '');
                  setView('edit_profil');
                }}
                className="text-[10px] bg-[#2F5233] text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm"
              >
                <Edit3 size={12} /> Edit Data
              </button>
            </div>

            <div className="space-y-3 text-xs bg-white/60 p-4 rounded-2xl border border-white/80 shadow-inner">
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-extrabold tracking-wider">Nama Lengkap</span>
                <p className="font-bold text-sm text-[#2C3531] mt-0.5">{userData?.nama || '-'}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-extrabold tracking-wider">Email Terdaftar</span>
                <p className="font-bold text-sm text-[#2C3531] mt-0.5">{userData?.email || '-'}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-extrabold tracking-wider">Peran Akun (Role)</span>
                <p className="font-bold text-sm text-[#2C3531] mt-0.5">{userData?.role || 'USER'}</p>
              </div>
            </div>

            <button onClick={() => { setView('dashboard'); setActiveTab('profil'); }} className="w-full bg-white/80 hover:bg-white text-gray-700 font-bold py-2.5 rounded-xl text-xs transition border border-gray-200 shadow-sm">
              Kembali
            </button>
          </div>
        </div>
      )}

      {/* FORM EDIT DATA DIRI / PROFIL */}
      {view === 'edit_profil' && (
        <div 
          className="min-h-screen flex flex-col items-center justify-center w-full bg-cover bg-center bg-no-repeat relative overflow-hidden max-w-md mx-auto p-5"
          style={{ backgroundImage: "url('/lainnya_3.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]"></div>

          <div className="absolute top-4 left-4 z-20">
            <button onClick={() => setView('detail_profil')} className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-md font-bold hover:bg-white transition">
              ←
            </button>
          </div>

          <div className="relative z-10 flex flex-col items-center mb-3 text-center">
            <h1 className="text-2xl font-black tracking-tight drop-shadow-md">
              <span className="text-[#2F5233]">PESAT</span> <span className="text-[#D27D2D]">GO!</span>
            </h1>
            <div className="w-12 h-1 bg-[#D27D2D] rounded-full mt-1 shadow-sm"></div>
          </div>

          <div className="relative z-10 w-full max-w-[340px] text-left bg-white/85 backdrop-blur-xl p-5 rounded-[24px] shadow-2xl border border-white/60 space-y-3">
            <div className="text-center mb-2">
              <h2 className="text-base font-black text-[#2F5233] tracking-tight">Edit Data Diri ✏️</h2>
              <p className="text-[11px] text-gray-600 font-medium mt-0.5">Perbarui informasi akun Anda</p>
            </div>
            
            <form onSubmit={handleProfileUpdate} className="space-y-3">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Nama Lengkap</label>
                <input type="text" required value={editNama} onChange={e => setEditNama(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Email</label>
                <input type="email" required value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <button type="submit" className="w-full bg-[#2F5233] hover:bg-[#234026] text-white font-extrabold py-3 rounded-xl shadow-lg transition-all transform active:scale-95 text-xs flex items-center justify-center gap-1.5 mt-2">
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FORM GANTI PASSWORD */}
      {view === 'ganti_password' && (
        <div 
          className="min-h-screen flex flex-col items-center justify-center w-full bg-cover bg-center bg-no-repeat relative overflow-hidden max-w-md mx-auto p-5"
          style={{ backgroundImage: "url('/lainnya_3.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]"></div>

          <div className="absolute top-4 left-4 z-20">
            <button onClick={() => { setView('dashboard'); setActiveTab('profil'); }} className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-md font-bold hover:bg-white transition">
              ←
            </button>
          </div>

          <div className="relative z-10 flex flex-col items-center mb-3 text-center">
            <h1 className="text-2xl font-black tracking-tight drop-shadow-md">
              <span className="text-[#2F5233]">PESAT</span> <span className="text-[#D27D2D]">GO!</span>
            </h1>
            <div className="w-12 h-1 bg-[#D27D2D] rounded-full mt-1 shadow-sm"></div>
          </div>

          <div className="relative z-10 w-full max-w-[340px] text-left bg-white/85 backdrop-blur-xl p-5 rounded-[24px] shadow-2xl border border-white/60 space-y-3">
            <div className="text-center mb-2">
              <h2 className="text-base font-black text-[#2F5233] tracking-tight">Ganti Password 🔑</h2>
              <p className="text-[11px] text-gray-600 font-medium mt-0.5">Amankan akun Anda dengan password baru</p>
            </div>
            
            <form onSubmit={handlePasswordUpdate} className="space-y-3">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Password Lama</label>
                <input type="password" required value={passwordLama} onChange={e => setPasswordLama(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#2F5233] mb-1 tracking-wider">Password Baru</label>
                <input type="password" required value={passwordBaru} onChange={e => setPasswordBaru(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/95 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5233] shadow-inner" />
              </div>
              <button type="submit" className="w-full bg-[#2F5233] hover:bg-[#234026] text-white font-extrabold py-3 rounded-xl shadow-lg transition-all transform active:scale-95 text-xs flex items-center justify-center gap-1.5 mt-2">
                Simpan Password Baru
              </button>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}