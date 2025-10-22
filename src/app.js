//fillter
let fillter=document.getElementById('search');
fillter.addEventListener('keyup',(e)=>{
  let search=fillter.value.toLowerCase();
  let items=document.querySelectorAll('.card');
  items.forEach((item)=>{
    let title=item.querySelector('.card-title').textContent.toLowerCase();
    if(title.indexOf(search)!=-1){
      item.style.display='';
    }else{
      item.style.display='none';
    }
  })
})



document.addEventListener('DOMContentLoaded', () => {
  // const grid: مرجع ثابت لحاوية الكروت
  const grid = document.getElementById('grid');
  // const catsRoot: مرجع ثابت لشريط التصنيفات
  const catsRoot = document.getElementById('cats');

  // let DATA: ستُملأ من JSON
  let DATA = [];
  // let currentCategory: التصنيف الحالي
  let currentCategory = 'all';

  // دالة صغيرة لتشذيب النص (تطبيع بسيط)
  const trim = (s) => (s ?? '').trim();

  // ⬅️ نفس كود الكرت لديك (لم ألمسه)
  function renderCards() {
    const list = DATA.filter(x => currentCategory === 'all' || trim(x.category) === currentCategory);
    if (!list.length) {
      grid.innerHTML = '<div class="col-12"><p class="text-muted text-center">لا توجد عناصر لعرضها.</p></div>';
      return;
    }
    grid.innerHTML = list.map(x => {
      const imgSrc = x.image || '/public/img/3.jpg';
      return `
        <div class="col-12 col-sm-6">
          <div class="card h-100 shadow-sm">
            <img src="${imgSrc}"  class="card-img-top" alt="${x.title}">
            <div class="card-body">
              <h5 class="card-title">${x.title}</h5>
              <p class="text-muted small mb-2">${x.description || ''}</p>
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center">
              <strong>${x.price ? x.price + ' ر.س' : ''}</strong>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // يفعّل تبويب + يحدّث التصنيف + يعيد الرسم
  function applyFilter(cat) {
    currentCategory = trim(cat || 'all');

    // تفعيل التبويب شكليًا
    document.querySelectorAll('#cats [data-cat]').forEach(t => {
      t.classList.toggle('active', trim(t.dataset.cat) === currentCategory);
    });

    // (اختياري) تحديث الهاش للمشاركة
    location.hash = currentCategory === 'all' ? '' : '#' + encodeURIComponent(currentCategory);

    renderCards();
  }

  // تفويض حدث للنقر ولوحة المفاتيح على شريط التصنيفات
  function wireTabs() {
    if (!catsRoot) return;
    catsRoot.addEventListener('click', (e) => {
      const t = e.target.closest('[data-cat]');
      if (t) applyFilter(t.dataset.cat);
    });
    catsRoot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const t = e.target.closest('[data-cat]');
        if (t) { e.preventDefault(); applyFilter(t.dataset.cat); }
      }
    });
  }

  // جلب البيانات ثم بدء الواجهة
  function start() {
    // غيّر المسار أدناه حسب مشروعك
    fetch('public/data/products.json', { cache: 'no-store' })
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(items => {
        DATA = (Array.isArray(items) ? items : [items]) // يقبل مصفوفة أو كائن واحد
               .filter(x => x.isActive !== false);      // عناصر فعّالة فقط
        wireTabs();
        const initial = decodeURIComponent(location.hash.slice(1) || 'all');
        applyFilter(initial);                            // أول عرض
      })
      .catch(err => {
        console.error(err);
        grid.innerHTML = '<div class="col-12"><p class="text-danger text-center">فشل تحميل البيانات.</p></div>';
      });
  }

  // دعم تغيير الهاش يدويًا
  window.addEventListener('hashchange', () => {
    applyFilter(decodeURIComponent(location.hash.slice(1) || 'all'));
  });

  start();
});
