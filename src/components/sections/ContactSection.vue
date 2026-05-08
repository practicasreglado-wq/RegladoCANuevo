<template>
  <section id="contacto" class="contact">
    <div class="container contact__inner">
      <div class="contact__copy">
        <p class="eyebrow">{{ $t('contact.eyebrow') }}</p>
        <SplitHeading :text="$t('contact.title')" tag="h2" />
        <p class="contact__subtitle">{{ $t('contact.subtitle') }}</p>

        <ul class="contact__info">
          <li>
            <span class="contact__info-label">Email</span>
            <a :href="`mailto:${$t('contact.info.email')}`">{{ $t('contact.info.email') }}</a>
          </li>
          <li>
            <span class="contact__info-label">Teléfono</span>
            <a :href="`tel:${$t('contact.info.phone').replace(/\s/g,'')}`">{{ $t('contact.info.phone') }}</a>
          </li>
          <li>
            <span class="contact__info-label">Sede</span>
            <span>{{ $t('contact.info.address') }}</span>
          </li>
          <li>
            <span class="contact__info-label">Horario</span>
            <span>{{ $t('contact.info.hours') }}</span>
          </li>
        </ul>
      </div>

      <form class="contact__form" novalidate @submit.prevent="onSubmit">
        <!-- Honeypot: invisible para usuarios, los bots lo rellenan -->
        <div class="hp" aria-hidden="true">
          <label for="hp-website">No rellenar este campo</label>
          <input id="hp-website" type="text" tabindex="-1" autocomplete="off" v-model="form.website" />
        </div>

        <div class="field">
          <label for="name">{{ $t('contact.form.name') }} *</label>
          <input id="name" type="text" required v-model="form.name" :class="{ 'is-error': errors.name }" autocomplete="name" />
          <span v-if="errors.name" class="field__error">{{ errors.name }}</span>
        </div>

        <div class="field-row">
          <div class="field">
            <label for="role">{{ $t('contact.form.role') }}</label>
            <select id="role" v-model="form.role">
              <option value="">—</option>
              <option v-for="r in roleOptions" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
          <div class="field">
            <label for="entity">{{ $t('contact.form.entity') }} *</label>
            <input id="entity" type="text" required v-model="form.entity" :class="{ 'is-error': errors.entity }" />
            <span v-if="errors.entity" class="field__error">{{ errors.entity }}</span>
          </div>
        </div>

        <div class="field-row">
          <div class="field">
            <label for="email">{{ $t('contact.form.email') }} *</label>
            <input id="email" type="email" required v-model="form.email" :class="{ 'is-error': errors.email }" autocomplete="email" />
            <span v-if="errors.email" class="field__error">{{ errors.email }}</span>
          </div>
          <div class="field">
            <label for="phone">{{ $t('contact.form.phone') }}</label>
            <input id="phone" type="tel" v-model="form.phone" autocomplete="tel" />
          </div>
        </div>

        <div class="field">
          <label for="service">{{ $t('contact.form.service') }}</label>
          <select id="service" v-model="form.service">
            <option value="">—</option>
            <option v-for="s in serviceOptions" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <div class="field">
          <label for="message">{{ $t('contact.form.message') }} *</label>
          <textarea id="message" rows="5" required v-model="form.message" :class="{ 'is-error': errors.message }"></textarea>
          <span v-if="errors.message" class="field__error">{{ errors.message }}</span>
        </div>

        <label class="check" :class="{ 'is-error': errors.rgpd }">
          <input type="checkbox" v-model="form.rgpd" />
          <span class="check__box" aria-hidden="true"></span>
          <i18n-t keypath="contact.form.rgpd" tag="span" class="check__label">
            <template #privacy>
              <a href="/privacidad" @click.stop>{{ $t('contact.form.privacy_link') }}</a>
            </template>
          </i18n-t>
        </label>

        <label class="check">
          <input type="checkbox" v-model="form.newsletter" />
          <span class="check__box" aria-hidden="true"></span>
          <span class="check__label">{{ $t('contact.form.newsletter') }}</span>
        </label>

        <MagneticButton tag="button" type="submit" class="btn btn--primary contact__submit" :disabled="status === 'sending'">
          <span v-if="status !== 'sending'">{{ $t('contact.form.submit') }}</span>
          <span v-else>{{ $t('contact.form.sending') }}</span>
          <span class="btn__arrow" v-if="status !== 'sending'">→</span>
        </MagneticButton>

        <transition name="fade">
          <p v-if="status === 'success'" class="contact__msg contact__msg--ok">{{ $t('contact.form.success') }}</p>
        </transition>
        <transition name="fade">
          <p v-if="status === 'error'" class="contact__msg contact__msg--err">{{ $t('contact.form.error') }}</p>
        </transition>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SplitHeading from '@/components/ui/SplitHeading.vue'
import MagneticButton from '@/components/ui/MagneticButton.vue'

const { t, tm } = useI18n({ useScope: 'global' })
const roleOptions = computed(() => tm('contact.form.role_options') || [])
const serviceOptions = computed(() => tm('contact.form.service_options') || [])

const form = reactive({
  name: '', role: '', entity: '', email: '', phone: '', service: '', message: '',
  rgpd: false, newsletter: false, website: '' // honeypot
})
const errors = reactive({})
const status = ref('idle') // idle | sending | success | error

let mountedAt = 0
onMounted(() => { mountedAt = Date.now() })

function validate() {
  for (const k of Object.keys(errors)) delete errors[k]
  if (!form.name.trim()) errors.name = t('contact.form.required')
  if (!form.entity.trim()) errors.entity = t('contact.form.required')
  if (!form.email.trim()) errors.email = t('contact.form.required')
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = t('contact.form.invalid_email')
  if (!form.message.trim()) errors.message = t('contact.form.required')
  if (!form.rgpd) errors.rgpd = t('contact.form.required')
  return Object.keys(errors).length === 0
}

async function onSubmit() {
  if (!validate()) return
  // Time-trap: rechazar si se envía en menos de 3s desde el mount
  if (Date.now() - mountedAt < 3000) { status.value = 'error'; return }
  // Honeypot: si está relleno, fingir éxito sin enviar
  if (form.website) { status.value = 'success'; return }

  status.value = 'sending'
  try {
    const res = await fetch('/api/contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: form.name, role: form.role, entity: form.entity,
        email: form.email, phone: form.phone, service: form.service,
        message: form.message, newsletter: form.newsletter,
        // metadata mínima para anti-spam
        elapsed: Date.now() - mountedAt,
        website: form.website
      })
    })
    if (!res.ok) throw new Error('Network')
    const json = await res.json().catch(() => ({}))
    if (json.ok === false) throw new Error('API')
    status.value = 'success'
    Object.assign(form, { name: '', role: '', entity: '', email: '', phone: '', service: '', message: '', rgpd: false, newsletter: false })
  } catch (e) {
    status.value = 'error'
  }
}
</script>

<style scoped>
.contact {
  padding: clamp(4rem, 9vw, 7rem) 0 clamp(4rem, 9vw, 7rem);
  background: var(--color-white);
  scroll-margin-top: var(--nav-height);
}
.contact__inner {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: clamp(2rem, 6vw, 5rem);
  align-items: start;
}
.contact__copy {
  position: sticky;
  top: 120px;
  animation: copy-appear 600ms var(--ease-out) 100ms both;
}
.contact__copy > * + * { margin-top: 1.2rem; }
@keyframes copy-appear {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: none; }
}

/* Eyebrow dorado */
.eyebrow { color: var(--color-gold); }

/* Título h2 blanco */
:deep(.split-word) { color: var(--color-white); }

/* Subtítulo blanco */
.contact__subtitle { color: var(--color-white); font-size: var(--fs-lg); }

.contact__info {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  display: grid; gap: 1.5rem;
}
.contact__info li { display: grid; grid-template-columns: 100px 1fr; gap: 1rem; align-items: baseline; }

/* Labels en dorado */
.contact__info-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-gold);
  font-weight: 600;
}

/* Valores en blanco con hover dorado en todo el item */
.contact__info a,
.contact__info li span:not(.contact__info-label) {
  color: var(--color-white);
  transition: color var(--t-fast);
}
.contact__info li:hover a,
.contact__info li:hover span:not(.contact__info-label) {
  color: var(--color-gold);
}

.contact__form {
  background: var(--color-white);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  display: grid; gap: 1.2rem;
  animation: form-appear 600ms var(--ease-out) 150ms both;
  position: relative;
  z-index: 2;
}
@keyframes form-appear {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: none; }
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}
@media (max-width: 580px) { .field-row { grid-template-columns: 1fr; } }

.field { display: grid; gap: 0.4rem; }
.field label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.field input, .field select, .field textarea {
  width: 100%;
  padding: 0.75rem 0.9rem;
  font-size: var(--fs-base);
  background: var(--color-bg-light);
  border: 1px solid transparent;
  border-radius: var(--radius);
  transition: border-color var(--t-fast), background var(--t-fast);
  font-family: inherit;
}
.field input:focus, .field select:focus, .field textarea:focus {
  outline: none;
  border-color: var(--color-gold);
  background: var(--color-white);
}
.field .is-error { border-color: #c0392b; background: #fff5f4; }
.field__error { font-size: 0.8rem; color: #c0392b; }

.check {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.7rem;
  align-items: start;
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  cursor: pointer;
  line-height: 1.5;
  padding-top: 0.5rem;
}
.check input { position: absolute; opacity: 0; pointer-events: none; }
.check__box {
  width: 18px; height: 18px;
  border: 1.5px solid var(--color-text-muted);
  border-radius: 3px;
  display: inline-block;
  margin-top: 2px;
  transition: all var(--t-fast);
  position: relative;
}
.check input:checked + .check__box {
  background: var(--color-gold);
  border-color: var(--color-gold);
}
.check input:checked + .check__box::after {
  content: '';
  position: absolute;
  left: 5px; top: 1px;
  width: 5px; height: 10px;
  border: solid var(--color-navy);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.check.is-error .check__box { border-color: #c0392b; }
.check__label :deep(a) { color: var(--color-navy); text-decoration: underline; }

.contact__submit { margin-top: 1rem; justify-self: start; }
.contact__submit:disabled { opacity: 0.6; cursor: wait; }

.contact__msg {
  padding: 0.9rem 1.1rem;
  border-radius: var(--radius);
  font-size: var(--fs-sm);
}
.contact__msg--ok { background: #e8f5ec; color: #1d6a3a; border: 1px solid #b9dec5; }
.contact__msg--err { background: #fdecea; color: #b03a2e; border: 1px solid #f5c6c2; }

.hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }

.fade-enter-active, .fade-leave-active { transition: opacity 300ms; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 880px) {
  .contact__inner { grid-template-columns: 1fr; }
  .contact__copy { position: static; }
}
</style>
