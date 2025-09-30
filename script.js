// script.js

// Örnek Görev Verileri
const initialTasks = [
    { id: 1, text: "Oda 203: İlaç (Antibiyotik)", time: "16:00", priority: "high", done: false },
    { id: 2, text: "Oda 204: Vital Belirti Ölçümü", time: "15:00", priority: "medium", done: false },
    { id: 3, text: "Oda 203: IV sıvı kontrolü", time: "14:30", priority: "low", done: true },
    { id: 4, text: "Oda 204: Pansuman değişimi", time: "17:00", priority: "high", done: false },
    { id: 5, text: "Oda 203: Doktor Ziyareti Sonrası Gözlem", time: "18:00", priority: "medium", done: false }
];

let tasks = initialTasks;

/**
 * Modüller Arası Geçiş (NAV) İşlevi
 */
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Aktif link ve modül sınıflarını yönet
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
        
        // Hedef modülü göster
        const targetId = this.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
        
        // Görevler modülüne geçildiğinde listeyi yeniden oluştur
        if (targetId === 'tasks') {
            renderTasks(); 
        }
    });
});

/**
 * Görev Listesini Oluşturma ve Güncelleme
 */
function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Önceki listeyi temizle
    let pendingCount = 0;

    // Görevleri saate göre sırala (Önce erken saatler)
    tasks.sort((a, b) => a.time.localeCompare(b.time));

    tasks.forEach(task => {
        const li = document.createElement('li');
        
        let priorityClass = '';
        if (task.priority === 'high') {
            priorityClass = 'priority-high';
        } else if (task.priority === 'medium') {
            priorityClass = 'priority-medium';
        }
        
        li.className = `${priorityClass} ${task.done ? 'task-done' : ''}`;
        
        // Görev içeriği ve Yapıldı/Yapılmadı butonu
        li.innerHTML = `
            <span><strong>${task.time}</strong> - ${task.text}</span>
            <button onclick="toggleTaskDone(${task.id})" class="button" style="padding: 5px 10px; background-color: ${task.done ? '#4caf50' : '#ff9800'};">${task.done ? 'Yapıldı' : 'Onayla'}</button>
        `;
        
        taskList.appendChild(li);

        if (!task.done) {
            pendingCount++;
        }
    });

    // Dashboard'daki bekleyen görev sayısını güncelle
    document.getElementById('pending-tasks-count').textContent = pendingCount;
}

/**
 * Görev Durumunu Değiştirme (Yapıldı/Yapılmadı)
 */
function toggleTaskDone(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex > -1) {
        tasks[taskIndex].done = !tasks[taskIndex].done; // Durumu tersine çevir
        renderTasks(); // Listeyi yeniden oluştur
    }
}

/**
 * Teslim Raporu Oluşturma
 */
function generateReport() {
    const notes = document.getElementById('notes-area').value;
    const completedTasks = tasks.filter(t => t.done).map(t => `${t.time} - ${t.text}`);
    const pendingTasks = tasks.filter(t => !t.done).map(t => `${t.time} - ${t.text}`);

    let reportText = `*** NÖBET TESLİM RAPORU ***\n`;
    reportText += `Tarih: ${new Date().toLocaleDateString('tr-TR')}\n`;
    reportText += `Saat: ${new Date().toLocaleTimeString('tr-TR')}\n\n`;
    
    reportText += `--- VARDİYA BOYUNCA ÖZEL NOTLAR ---\n`;
    reportText += `${notes || 'Bugün özel not girilmedi.'}\n\n`;

    reportText += `--- TAMAMLANAN GÖREVLER (${completedTasks.length}) ---\n`;
    reportText += completedTasks.length > 0 ? completedTasks.join('\n') : 'Yok';
    reportText += `\n\n`;

    reportText += `--- BEKLEYEN/DEVREDİLEN GÖREVLER (${pendingTasks.length}) ---\n`;
    reportText += pendingTasks.length > 0 ? pendingTasks.join('\n') : 'Yok';
    
    const reportOutput = document.getElementById('report-output');
    reportOutput.textContent = reportText;
    reportOutput.style.display = 'block';
    
    // Raporu kopyalamayı kolaylaştırmak için alert yerine mesaj gösterilebilir
    alert('Teslim Raporu Başarıyla Oluşturuldu! Kopyalamak için metin alanını kullanabilirsiniz.');
}

/**
 * Sayfa Yüklendiğinde Başlat
 */
document.addEventListener('DOMContentLoaded', () => {
    renderTasks(); // İlk görev listesini oluştur
});