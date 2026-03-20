/**
 * HK금융파트너스 금융 컨설턴트 모집 랜딩페이지
 * main.js – 강화된 스크롤 애니메이션 v3 + 폼 처리 + Table API
 */

const TABLE_NAME = 'hk_recruit_applications';
const KAKAO_URL  = 'https://open.kakao.com/o/sZeVtimi';

// ─────────────────────────────────────────────
// 진입점
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initFloatingCTA();
    initBottomBar();
    initSmoothScroll();
    initFormValidation();
    initPhoneAutoFormat();
    initCountUpStats();
    initSectionHighlight();
    initScrollProgress();
    initParallax();
    initKakaoModal();
    initTouchRipple();
    initHoverTilt();
    initSectionColorShift();
});

// ═════════════════════════════════════════════
// 1. 통합 스크롤 IntersectionObserver
// ═════════════════════════════════════════════
function initScrollAnimations() {
    const isMobile = window.innerWidth <= 768;

    // ── ① 모든 진입 애니메이션 클래스 감지 ──
    const allAnimated = document.querySelectorAll(
        '.animate-slide-up, .animate-slide-left, .animate-slide-right, ' +
        '.animate-scale-in, .section-divider'
    );

    const enterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            enterObserver.unobserve(entry.target);
        });
    }, {
        threshold: isMobile ? 0.03 : 0.07,
        rootMargin: isMobile ? '0px 0px -5px 0px' : '0px 0px -50px 0px',
    });

    allAnimated.forEach(el => enterObserver.observe(el));

    // ── ② 카드 그룹 - 순차 팝인 (더 역동적으로) ──
    const CARD_GROUPS = [
        { parent: '.company-grid',    children: '.company-card'  },
        { parent: '.benefits-grid',   children: '.benefit-item'  },
        { parent: '.target-grid',     children: '.target-card'   },
        { parent: '.settlement-grid', children: '.settle-card'   },
        { parent: '.risk-cards',      children: '.risk-card'     },
        { parent: '.role-card-wrap',    children: '.role-icon-card'},
        { parent: '.process-steps',     children: '.process-step'  },
        { parent: '.hero-copy-cards',   children: '.copy-card'     },
        { parent: '.hero-stats-grid',   children: '.stat-card-box' },
    ];

    CARD_GROUPS.forEach(({ parent, children }) => {
        const el = document.querySelector(parent);
        if (!el) return;
        const cards = el.querySelectorAll(children);
        // 초기 상태: 모든 카드 숨김
        cards.forEach(c => {
            c.style.opacity   = '0';
            c.style.transform = 'translateY(50px) scale(.9)';
            c.style.transition = 'none';
        });

        const obs = new IntersectionObserver((entries) => {
            const e = entries[0];
            if (!e.isIntersecting) return;
            cards.forEach((card, i) => {
                const delay = i * (isMobile ? 70 : 90);
                setTimeout(() => {
                    card.style.transition =
                        `opacity .6s cubic-bezier(.22,1,.36,1),
                         transform .6s cubic-bezier(.22,1,.36,1)`;
                    card.style.opacity   = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, delay);
            });
            obs.unobserve(el);
        }, {
            threshold: 0.04,
            rootMargin: isMobile ? '0px 0px 10px 0px' : '0px 0px -20px 0px',
        });

        obs.observe(el);
    });

    // ── ③ 히어로 통계 숫자 pop-in ──
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroStats.style.opacity = '0';
        heroStats.style.transform = 'translateY(30px) scale(.96)';
        setTimeout(() => {
            heroStats.style.transition = 'opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1)';
            heroStats.style.opacity = '1';
            heroStats.style.transform = 'translateY(0) scale(1)';
        }, 900);
    }

    // ── ④ 이미지 카피 박스 진입 애니메이션 ──
    document.querySelectorAll('.img-copy-box').forEach(box => {
        box.style.opacity = '0';
        box.style.transform = box.classList.contains('animate-slide-right')
            ? 'translateX(60px)' : 'translateX(-60px)';
        box.style.transition = 'none';
        const imgObs = new IntersectionObserver((entries) => {
            if (!entries[0].isIntersecting) return;
            setTimeout(() => {
                box.style.transition = 'opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)';
                box.style.opacity = '1';
                box.style.transform = 'translateX(0)';
            }, 150);
            imgObs.unobserve(box);
        }, { threshold: 0.1 });
        imgObs.observe(box);
    });

    // ── ⑤ 이미지 배경 kenburns 효과 ──
    document.querySelectorAll('.img-copy-section').forEach(sec => {
        const imgEl = sec.querySelector('.img-bg');
        if (!imgEl) return;
        const kbObs = new IntersectionObserver((entries) => {
            if (!entries[0].isIntersecting) return;
            imgEl.style.transition = 'transform 8s ease-out';
            imgEl.style.transform = 'scale(1.06)';
            kbObs.unobserve(sec);
        }, { threshold: 0.15 });
        kbObs.observe(sec);
    });
}

// ═════════════════════════════════════════════
// 2. 섹션 진입 하이라이트 + 배경색 이동
// ═════════════════════════════════════════════
function initSectionHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const title = entry.target.querySelector('.section-title');
            if (title) {
                title.classList.remove('pulse-once');
                void title.offsetWidth;
                title.classList.add('pulse-once');
                // 글자 반짝임 효과
                title.style.transition = 'color .5s ease';
                setTimeout(() => { title.style.transition = ''; }, 600);
            }
            const divider = entry.target.querySelector('.section-divider');
            if (divider && !divider.dataset.shown) {
                divider.dataset.shown = '1';
                setTimeout(() => divider.classList.add('visible'), 200);
            }
            // 섹션 레이블 슬라이드인
            const label = entry.target.querySelector('.section-label');
            if (label && !label.dataset.animated) {
                label.dataset.animated = '1';
                label.style.opacity = '0';
                label.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    label.style.transition = 'opacity .5s ease, transform .5s ease';
                    label.style.opacity = '1';
                    label.style.transform = 'translateX(0)';
                }, 100);
            }
        });
    }, { threshold: 0.1 });
    sections.forEach(s => obs.observe(s));
}

// ═════════════════════════════════════════════
// 3. 스크롤 프로그레스 바 (상단)
// ═════════════════════════════════════════════
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.style.cssText = `
        position:fixed; top:0; left:0; height:3px; width:0%;
        background:linear-gradient(90deg,#0A3D91,#1C7ED6,#F5A623);
        z-index:99999; transition:width .08s linear; pointer-events:none;
        border-radius:0 2px 2px 0; box-shadow:0 0 8px rgba(245,166,35,.5);
    `;
    document.body.prepend(bar);
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        requestAnimationFrame(() => {
            const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
            bar.style.width = pct + '%';
            ticking = false;
        });
        ticking = true;
    }, { passive: true });
}

// ═════════════════════════════════════════════
// 4. 히어로 패럴랙스 + 마우스 틸트
// ═════════════════════════════════════════════
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // 자이로스코프 (모바일)
    if (window.DeviceOrientationEvent && window.innerWidth <= 768) {
        window.addEventListener('deviceorientation', (e) => {
            const x = (e.gamma || 0) / 45;
            const y = (e.beta  || 0) / 90;
            hero.style.backgroundPosition = `${50 + x * 5}% ${50 + y * 5}%`;
        }, { passive: true });
    }

    // 마우스 (데스크탑) – 오버레이 이동 + 서클 이동
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        const overlay = hero.querySelector('.hero-bg-overlay');
        if (overlay) overlay.style.transform = `translate(${x * 18}px, ${y * 12}px)`;
        // 히어로 타이틀 미세 이동
        const title = hero.querySelector('.hero-title');
        if (title) title.style.transform = `translate(${x * 6}px, ${y * 4}px)`;
    }, { passive: true });
    hero.addEventListener('mouseleave', () => {
        const overlay = hero.querySelector('.hero-bg-overlay');
        if (overlay) overlay.style.transform = '';
        const title = hero.querySelector('.hero-title');
        if (title) title.style.transform = '';
    });

    // 스크롤 패럴랙스
    let ptick = false;
    window.addEventListener('scroll', () => {
        if (ptick) return;
        requestAnimationFrame(() => {
            hero.style.backgroundPositionY = `calc(50% + ${window.scrollY * .28}px)`;
            ptick = false;
        });
        ptick = true;
    }, { passive: true });
}

// ═════════════════════════════════════════════
// 5. 카드 3D 틸트 효과 (데스크탑 hover)
// ═════════════════════════════════════════════
function initHoverTilt() {
    if (window.innerWidth <= 768) return; // 모바일 제외
    const cards = document.querySelectorAll(
        '.company-card, .benefit-item, .target-card, .risk-card, .settle-card, .role-icon-card'
    );
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transform = `translateY(-8px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale(1.03)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform .4s ease, box-shadow .4s ease, border-color .4s ease';
        });
    });
}

// ═════════════════════════════════════════════
// 6. 섹션 배경색 전환 효과
// ═════════════════════════════════════════════
function initSectionColorShift() {
    const sections = document.querySelectorAll('section[id]');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            // 진입 시 살짝 밝아지는 flash 효과
            const el = entry.target;
            el.style.transition = 'filter .4s ease';
            el.style.filter = 'brightness(1.03)';
            setTimeout(() => { el.style.filter = 'brightness(1)'; }, 400);
        });
    }, { threshold: 0.15 });
    sections.forEach(s => obs.observe(s));
}

// ═════════════════════════════════════════════
// 7. 플로팅 CTA + 하단 바
// ═════════════════════════════════════════════
function initFloatingCTA() {
    const floatCta = document.getElementById('floatCta');
    if (!floatCta) return;
    window.addEventListener('scroll', () => {
        floatCta.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
}

function initBottomBar() {
    const bar = document.getElementById('bottomApplyBar');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        bar.classList.toggle('visible', window.scrollY > 200);
    }, { passive: true });
}

// ═════════════════════════════════════════════
// 8. 터치 리플 효과 (모바일 버튼)
// ═════════════════════════════════════════════
function initTouchRipple() {
    document.querySelectorAll('.btn, .target-card, .benefit-item, .company-card, .settle-card, .risk-card').forEach(el => {
        el.addEventListener('touchstart', function(e) {
            const ripple = document.createElement('span');
            const rect   = el.getBoundingClientRect();
            const touch  = e.touches[0];
            const size   = Math.max(rect.width, rect.height) * 1.8;
            const x = touch.clientX - rect.left - size / 2;
            const y = touch.clientY - rect.top  - size / 2;
            ripple.style.cssText = `
                position:absolute; width:${size}px; height:${size}px;
                left:${x}px; top:${y}px;
                background:rgba(255,255,255,.22);
                border-radius:50%;
                transform:scale(0);
                animation:rippleExpand .6s ease-out forwards;
                pointer-events:none; z-index:99;
            `;
            const prevPos = el.style.position;
            if (!prevPos || prevPos === 'static') el.style.position = 'relative';
            el.style.overflow = 'hidden';
            el.appendChild(ripple);
            setTimeout(() => ripple.remove(), 650);
        }, { passive: true });
    });
    if (!document.getElementById('rippleStyle')) {
        const style = document.createElement('style');
        style.id = 'rippleStyle';
        style.textContent = `@keyframes rippleExpand { to { transform: scale(1); opacity: 0; } }`;
        document.head.appendChild(style);
    }
}

// ═════════════════════════════════════════════
// 9. 부드러운 앵커 스크롤
// ═════════════════════════════════════════════
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href').replace('#', '');
            if (!id) return;
            const el = document.getElementById(id);
            if (!el) return;
            e.preventDefault();
            const hh = document.querySelector('.site-header')?.offsetHeight || 68;
            const extraOffset = (id === 'applyFormWrap') ? 16 : 12;
            window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - hh - extraOffset, behavior: 'smooth' });
        });
    });
}

// ═════════════════════════════════════════════
// 10. 개인정보 토글
// ═════════════════════════════════════════════
function togglePrivacy() {
    const detail = document.getElementById('privacyDetail');
    if (!detail) return;
    const vis = detail.style.display === 'block';
    detail.style.display = vis ? 'none' : 'block';
    const btn = document.querySelector('.privacy-toggle');
    if (btn) btn.textContent = vis ? '내용 보기' : '접기';
}

// ═════════════════════════════════════════════
// 11. 폼 유효성 + 제출
// ═════════════════════════════════════════════
function initFormValidation() {
    const form = document.getElementById('applyForm');
    if (!form) return;
    form.querySelectorAll('input, select').forEach(f => {
        f.addEventListener('input',  () => clearError(f.id));
        f.addEventListener('change', () => clearError(f.id));
    });
    form.addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) {
        const firstErr = document.querySelector('.field-error:not(:empty)');
        firstErr?.closest('.form-group')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    const btn  = document.getElementById('submitBtn');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>&nbsp;신청 중...';
    const data = collectFormData();
    try {
        await saveApplication(data);
        showSuccess(data);
        setTimeout(() => triggerKakaoNotice(data), 1200);
    } catch (err) {
        console.error('저장 실패:', err);
        showSuccess(data);
        setTimeout(() => triggerKakaoNotice(data), 1200);
    } finally {
        btn.disabled  = false;
        btn.innerHTML = orig;
    }
}

function collectFormData() {
    const genderEl = document.querySelector('input[name="gender"]:checked');
    return {
        name:           getVal('name'),
        age:            parseInt(getVal('age'), 10) || null,
        gender:         genderEl ? genderEl.value : '',
        phone:          formatPhone(getVal('phone')),
        region:         getVal('region'),
        career:         getVal('career'),
        privacy_agreed: document.getElementById('privacy_agreed').checked,
        status:         '접수',
    };
}

function getVal(id)   { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
function formatPhone(p) {
    const d = p.replace(/\D/g, '');
    if (d.length === 11) return d.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    if (d.length === 10) return d.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    return p;
}

async function saveApplication(data) {
    const res = await fetch(`tables/${TABLE_NAME}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

function validateForm() {
    let ok = true;
    const name = getVal('name');
    if (!name || name.length < 2) { showError('name', '이름을 2자 이상 입력해 주세요.'); ok = false; }
    const age = parseInt(getVal('age'), 10);
    if (!age || age < 18 || age > 70) { showError('age', '나이를 올바르게 입력해 주세요. (18~70세)'); ok = false; }
    const genderEl = document.querySelector('input[name="gender"]:checked');
    if (!genderEl) { showError('gender', '성별을 선택해 주세요.'); ok = false; }
    const phone = getVal('phone').replace(/\D/g, '');
    if (!phone || phone.length < 10 || phone.length > 11) {
        showError('phone', '올바른 전화번호를 입력해 주세요. (예: 010-0000-0000)'); ok = false;
    }
    if (!getVal('region')) { showError('region', '지역을 선택해 주세요.'); ok = false; }
    if (!getVal('career')) { showError('career', '경력/신입을 선택해 주세요.'); ok = false; }
    if (!document.getElementById('privacy_agreed').checked) {
        showError('privacy', '개인정보 수집·이용에 동의해 주세요.'); ok = false;
    }
    return ok;
}

function showError(fieldId, msg) {
    const f = document.getElementById(fieldId);
    const e = document.getElementById(`${fieldId}-error`);
    if (f) { f.classList.add('error'); f.style.borderColor = '#EF4444'; }
    if (e) e.textContent = msg;
}
function clearError(fieldId) {
    const f = document.getElementById(fieldId);
    const e = document.getElementById(`${fieldId}-error`);
    if (f) { f.classList.remove('error'); f.style.borderColor = ''; }
    if (e) e.textContent = '';
}

function showSuccess(data) {
    const form    = document.getElementById('applyForm');
    const success = document.getElementById('applySuccess');
    if (form)    form.style.display = 'none';
    if (success) {
        const nameEl = success.querySelector('.success-name');
        if (nameEl) nameEl.textContent = data.name;
        success.style.display = 'block';
        success.style.animation = 'fadeUp .6s ease forwards';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ═════════════════════════════════════════════
// 12. 카카오 모달
// ═════════════════════════════════════════════
function triggerKakaoNotice(data) {
    const modal = document.getElementById('kakaoNoticeModal');
    if (!modal) return;
    const msgEl = modal.querySelector('.kakao-notice-msg');
    if (msgEl) {
        msgEl.innerHTML =
            `<strong>${esc(data.name)}</strong>님의 신청이 접수되었습니다.<br>` +
            `담당자가 <strong>${esc(data.phone)}</strong>으로 연락드릴 예정입니다.<br><br>` +
            `더 빠른 안내를 원하시면 카카오톡으로 문의해 주세요!`;
    }
    modal.classList.add('show');
}

function esc(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function initKakaoModal() {
    const modal = document.getElementById('kakaoNoticeModal');
    if (!modal) return;
    modal.querySelector('.kakao-notice-close')   ?.addEventListener('click', () => modal.classList.remove('show'));
    modal.querySelector('.kakao-notice-overlay') ?.addEventListener('click', () => modal.classList.remove('show'));
}

// ═════════════════════════════════════════════
// 13. 전화번호 자동 포맷
// ═════════════════════════════════════════════
function initPhoneAutoFormat() {
    const inp = document.getElementById('phone');
    if (!inp) return;
    inp.addEventListener('input', (e) => {
        let d = e.target.value.replace(/\D/g, '').slice(0, 11);
        if (d.length > 7)      d = d.slice(0,3) + '-' + d.slice(3,7) + '-' + d.slice(7);
        else if (d.length > 3) d = d.slice(0,3) + '-' + d.slice(3);
        e.target.value = d;
    });
}

// ═════════════════════════════════════════════
// 14. 히어로 통계 카드 카운트업 (생동감 강화)
// ═════════════════════════════════════════════
function initCountUpStats() {
    // 새 stat-card-box 방식 (data-target 속성)
    const cardNums = document.querySelectorAll('.stat-card-box .stat-num[data-target]');
    if (cardNums.length > 0) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                const suffix = el.dataset.suffix || '';
                if (!isNaN(target)) animateStatCard(el, target, suffix, 2200);
                obs.unobserve(el);
            });
        }, { threshold: 0.3 });
        cardNums.forEach(el => obs.observe(el));
    } else {
        // fallback: 구 방식
        const nums = document.querySelectorAll('.stat-num');
        const obs2 = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const smallEl = el.querySelector('small');
                const smallTxt = smallEl ? smallEl.textContent : '';
                const raw = el.textContent.replace(smallTxt, '').replace(/[,+억년]/g,'').trim();
                const target = parseFloat(raw);
                if (!isNaN(target)) countUp(el, target, smallEl, smallTxt, 2000);
                obs2.unobserve(el);
            });
        }, { threshold: 0.5 });
        nums.forEach(el => obs2.observe(el));
    }
}

function animateStatCard(el, target, suffix, dur) {
    el.style.display = 'block';
    const start = performance.now();
    let lastV = -1;
    function update(now) {
        const p = Math.min((now - start) / dur, 1);
        // 탄력적인 easing
        const ease = 1 - Math.pow(1 - p, 3.5);
        const v = Math.round(ease * target);
        if (v !== lastV) {
            // 100의 배수마다 숫자 scale 펄스
            const unit = target > 1000 ? 100 : 10;
            if (lastV !== -1 && v % unit === 0 && v > 0) {
                el.style.transform = 'scale(1.18)';
                el.style.transition = 'transform .1s ease';
                setTimeout(() => { el.style.transform = 'scale(1)'; el.style.transition = 'transform .15s ease'; }, 100);
            }
            const formatted = target >= 1000 ? v.toLocaleString() : v;
            el.innerHTML = `${formatted}<small>${suffix}</small>`;
            lastV = v;
        }
        if (p < 1) requestAnimationFrame(update);
        else {
            const finalFmt = target >= 1000 ? target.toLocaleString() : target;
            el.innerHTML = `${finalFmt}<small>${suffix}</small>`;
            // 완료 후 최종 펄스
            el.style.transform = 'scale(1.22)';
            el.style.transition = 'transform .12s ease';
            setTimeout(() => { el.style.transform = 'scale(1)'; el.style.transition = 'transform .2s ease'; }, 120);
        }
    }
    requestAnimationFrame(update);
}

function countUp(el, target, smallEl, smallTxt, dur) {
    const start = performance.now();
    function update(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        const v = Math.round(ease * target);
        el.innerHTML = smallEl
            ? `${v.toLocaleString()}<small>${smallTxt}</small>`
            : v.toLocaleString();
        if (p < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}
