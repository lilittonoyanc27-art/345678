import {
  EXERCISE_1_TEXT,
  EXERCISE_1_QUESTIONS,
  TEST_QUESTIONS,
  EXERCISE_3_POEM,
  EXERCISE_3_QUESTIONS,
  METRICA_ITEMS,
  FIGURE_NAMES,
  LEVEL_NAMES,
  EXERCISE_4_ITEMS,
  EXERCISE_4_EXTRA,
  EXERCISE_5_SCRIPT,
  EXERCISE_5_QUESTIONS,
  EXERCISE_6_TEXTS,
  EXERCISE_6_QUESTIONS,
  ORAL_QUESTIONS,
  CHECKLIST_ITEMS
} from './data.js';

const STORAGE_KEY_CHECKLIST = 'es_hy_lit_checklist_v1';

const state = {
  allTranslationsOpen: false,
  activeSectionFilter: 'all',
  testAnswers: {},
  testChecked: false,
  metricaAnswers: {},
  metricaChecked: {},
  figurasAnswers: {},
  figurasChecked: {},
  ex6ClassAnswers: { A: '', B: '', C: '' },
  ex6ClassChecked: false,
  checklist: loadChecklist()
};

function loadChecklist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHECKLIST);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === CHECKLIST_ITEMS.length) {
        return parsed.map(Boolean);
      }
    }
  } catch {
    // Ignore storage access errors
  }
  return new Array(CHECKLIST_ITEMS.length).fill(false);
}

function saveChecklist() {
  try {
    localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(state.checklist));
  } catch {
    // Ignore storage access errors
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function trBlock(esHtml, hyText, extraBtnClass = '') {
  const openClass = state.allTranslationsOpen ? 'is-open' : '';
  return `
    <div class="tr-wrap">
      <button type="button" class="es-block ${openClass} ${extraBtnClass}" data-tr-toggle aria-expanded="${state.allTranslationsOpen ? 'true' : 'false'}">
        <span>${esHtml}</span><span class="es-hint-mark" aria-hidden="true">Հայ</span>
      </button>
      <div class="hy-drawer ${openClass}">
        <span class="font-semibold text-[#9A3B1E]">Հայերեն:</span> ${escapeHtml(hyText)}
      </div>
    </div>
  `;
}

function trInline(esText, hyText) {
  const openClass = state.allTranslationsOpen ? 'is-open' : '';
  return `
    <span class="tr-inline-wrap">
      <button type="button" class="es-inline ${openClass}" data-tr-inline-toggle aria-expanded="${state.allTranslationsOpen ? 'true' : 'false'}">
        ${escapeHtml(esText)}<span class="es-hint-mark" aria-hidden="true">Հայ</span>
      </button>
      <span class="hy-inline-drawer ${openClass}">
        <span class="font-semibold text-[#9A3B1E]">Հայերեն:</span> ${escapeHtml(hyText)}
      </span>
    </span>
  `;
}

function renderOpenQuestionCard(q, prefix) {
  const key = `${prefix}-${q.id}`;
  return `
    <div class="border border-[#E5D9C8] rounded-xl bg-[#FFFDF9] p-5 space-y-3.5">
      <div class="flex items-start gap-2.5">
        <span class="font-mono-num text-base font-semibold text-[#B84A27] shrink-0 pt-0.5">${q.id}.</span>
        <div class="flex-1">
          ${trBlock(escapeHtml(q.es), q.hy, 'font-medium text-[#231914]')}
        </div>
      </div>
      <div class="space-y-2.5 pt-1">
        <textarea
          rows="2"
          data-open-input="${key}"
          placeholder="Escribe tu respuesta en español..."
          class="w-full rounded-lg border border-[#D6C7B2] bg-[#FAF6F0] px-3.5 py-2.5 text-base text-[#231914] placeholder:text-[#7A6658] focus:bg-[#FFFDF9] focus:border-[#B84A27] focus:outline-none"
        ></textarea>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-toggle-sample="${key}"
            class="px-3.5 py-2 text-sm font-semibold rounded-lg border border-[#D6C7B2] bg-[#FFFDF9] text-[#231914] hover:bg-[#F3ECE1] transition-colors cursor-pointer"
          >
            Проверить по образцу
          </button>
          <button
            type="button"
            data-mark-open="${key}:ok"
            class="px-3.5 py-2 text-sm font-medium rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] text-[#14532D] hover:bg-[#DCFCE7] transition-colors cursor-pointer hidden"
            data-eval-btn="${key}"
          >
            ✓ Верно
          </button>
          <button
            type="button"
            data-mark-open="${key}:wrong"
            class="px-3.5 py-2 text-sm font-medium rounded-lg border border-[#FECACA] bg-[#FEF2F2] text-[#7F1D1D] hover:bg-[#FEE2E2] transition-colors cursor-pointer hidden"
            data-eval-btn="${key}"
          >
            ✕ Неверно
          </button>
        </div>
        <div id="sample-${key}" class="hidden rounded-lg border border-[#E5D9C8] bg-[#FAF6F0] p-4 space-y-2 text-base">
          <p class="text-sm font-semibold text-[#B84A27]">Образец ответа (нажми на текст для перевода):</p>
          ${trBlock(escapeHtml(q.solEs), q.solHy, 'font-medium text-[#231914]')}
          <div id="eval-msg-${key}" class="hidden pt-2 border-t border-[#E5D9C8] text-sm"></div>
        </div>
      </div>
    </div>
  `;
}

function renderParteI() {
  return `
    <section id="parte-1" class="section-block space-y-8" data-section="parte-1">
      <div class="border-b border-[#E5D9C8] pb-4">
        <p class="text-sm font-semibold tracking-wide text-[#B84A27] mb-1">PARTE I</p>
        <h2 class="text-3xl sm:text-4xl font-bold text-[#231914]">PARTE I. TEORÍA COMPLETA</h2>
      </div>

      <!-- 1. ¿Qué es la literatura? -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-5">
        <h3 class="text-2xl sm:text-3xl font-bold text-[#231914]">1. ${trInline('¿Qué es la literatura?', 'Ի՞նչ է գրականությունը։')}</h3>
        <div class="space-y-2">
          ${trBlock(
            'La literatura es una forma de expresión artística que utiliza las palabras para transmitir ideas, emociones, sentimientos e historias.',
            'Գրականությունը արվեստի տեսակ է, որն օգտագործում է բառերը՝ մտքեր, հույզեր, զգացմունքներ և պատմություններ փոխանցելու համար։'
          )}
        </div>

        <div class="space-y-3">
          <h4 class="text-lg font-semibold text-[#231914]">${trInline('Características', 'Հատկանիշներ')}</h4>
          <ul class="space-y-2 list-disc pl-6 text-[#231914]">
            <li>${trBlock('Tiene una intención artística.', 'Ունի գեղարվեստական նպատակ։')}</li>
            <li>${trBlock('Puede expresar sentimientos.', 'Կարող է արտահայտել զգացմունքներ։')}</li>
            <li>${trBlock('Utiliza recursos literarios.', 'Օգտագործում է գրական արտահայտչամիջոցներ։')}</li>
            <li>${trBlock('Puede estar escrita en prosa o en verso.', 'Կարող է գրված լինել արձակ կամ չափածո։')}</li>
            <li>${trBlock('Puede contar historias reales o imaginarias.', 'Կարող է պատմել իրական կամ երևակայական պատմություններ։')}</li>
          </ul>
        </div>

        <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-lg p-5 space-y-2">
          <h4 class="text-sm font-semibold text-[#B84A27]">${trInline('Pregunta de examen', 'Քննական հարց')}</h4>
          ${trBlock(
            '¿Cuál es la finalidad principal del lenguaje literario?',
            'Ո՞րն է գրական լեզվի հիմնական նպատակը։',
            'font-medium'
          )}
          <div class="pt-1">
            ${trBlock(
              '<strong>Respuesta:</strong> Crear belleza mediante las palabras y transmitir emociones, ideas o experiencias.',
              'Բառերի միջոցով գեղեցկություն ստեղծել և փոխանցել զգացմունքներ, մտքեր կամ փորձառություններ։'
            )}
          </div>
        </div>
      </article>

      <!-- 2. El lenguaje literario -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-5">
        <h3 class="text-2xl sm:text-3xl font-bold text-[#231914]">2. ${trInline('El lenguaje literario', 'Գրական լեզու')}</h3>
        ${trBlock(
          'El lenguaje literario o poético es una forma especial de utilizar las palabras para crear belleza, expresar emociones y producir un efecto en el lector.',
          'Գրական կամ բանաստեղծական լեզուն բառերի օգտագործման հատուկ ձև է, որի նպատակն է ստեղծել գեղեցկություն, արտահայտել զգացմունքներ և ազդեցություն թողնել ընթերցողի վրա։'
        )}

        <div class="overflow-x-auto border border-[#E5D9C8] rounded-lg">
          <table class="study-table">
            <thead>
              <tr>
                <th>${trInline('Lenguaje cotidiano', 'Առօրյա լեզու')}</th>
                <th>${trInline('Lenguaje literario', 'Գրական լեզու')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${trBlock('Hace mucho frío.', 'Շատ ցուրտ է։')}</td>
                <td>${trBlock('El frío abraza las calles.', 'Ցուրտը գրկում է փողոցները։')}</td>
              </tr>
              <tr>
                <td>${trBlock('El sol aparece.', 'Արևը երևում է / դուրս է գալիս։')}</td>
                <td>${trBlock('El sol despierta lentamente.', 'Արևը դանդաղ արթնանում է։')}</td>
              </tr>
              <tr>
                <td>${trBlock('Estoy muy triste.', 'Ես շատ տխուր եմ։')}</td>
                <td>${trBlock('Mi corazón está lleno de sombras.', 'Սիրտս լցված է ստվերներով։')}</td>
              </tr>
              <tr>
                <td>${trBlock('El viento sopla.', 'Քամին փչում է։')}</td>
                <td>${trBlock('El viento susurra entre los árboles.', 'Քամին շշնջում է ծառերի միջև։')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="text-base text-[#5C4B40]">В первом столбце предложения даны в прямом значении, во втором используются образные выражения.</p>
        <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-lg p-5">
          ${trBlock(
            '<strong>Muy importante:</strong> El lenguaje literario puede utilizar metáforas, comparaciones, personificaciones, repeticiones, ritmo y rima.',
            'Գրական լեզուն կարող է օգտագործել փոխաբերություններ, համեմատություններ, անձնավորումներ, կրկնություններ, ռիթմ և հանգ։'
          )}
        </div>
      </article>

      <!-- 3. La prosa y el verso -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-5">
        <h3 class="text-2xl sm:text-3xl font-bold text-[#231914]">3. ${trInline('La prosa y el verso', 'Արձակ և չափածո')}</h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="border border-[#E5D9C8] rounded-lg p-5 space-y-3">
            <h4 class="text-xl font-semibold text-[#231914]">${trInline('Prosa', 'Արձակ')}</h4>
            ${trBlock('Se escribe normalmente en líneas continuas y párrafos.', 'Գրվում է սովորական տողերով և պարբերություններով։')}
            <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-md p-3.5 italic">
              ${trBlock('Laura abrió la ventana. El jardín estaba lleno de flores y pájaros.', 'Լաուրան բացեց պատուհանը։ Այգին լի էր ծաղիկներով և թռչուններով։')}
            </div>
          </div>

          <div class="border border-[#E5D9C8] rounded-lg p-5 space-y-3">
            <h4 class="text-xl font-semibold text-[#231914]">${trInline('Verso', 'Չափածո')}</h4>
            ${trBlock('Se organiza en versos y puede tener ritmo, métrica y rima.', 'Կազմված է բանաստեղծական տողերից և կարող է ունենալ ռիթմ, չափ և հանգ։')}
            <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-md p-3.5 italic space-y-1">
              ${trBlock('La luna mira el jardín,', 'Լուսինը նայում է այգուն,')}
              ${trBlock('la noche empieza a dormir.', 'գիշերը սկսում է քնել։')}
            </div>
          </div>
        </div>
        <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-lg p-5">
          ${trBlock(
            '<strong>Atención:</strong> No todos los poemas tienen rima. Existen versos libres.',
            'Ոչ բոլոր բանաստեղծություններն են հանգավորվում․ կան ազատ չափածո տողեր։'
          )}
        </div>
      </article>

      <!-- 4. La literatura popular y la literatura culta -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-6">
        <h3 class="text-2xl sm:text-3xl font-bold text-[#231914]">4. ${trInline('La literatura popular y la literatura culta', 'Ժողովրդական և հեղինակային գրականություն')}</h3>

        <div class="space-y-4">
          <h4 class="text-xl font-semibold text-[#231914]">A. ${trInline('La literatura popular', 'Ժողովրդական գրականություն')}</h4>
          ${trBlock(
            'La literatura popular pertenece a la tradición de un pueblo y generalmente se transmite de generación en generación de forma oral.',
            'Ժողովրդական գրականությունը պատկանում է ժողովրդի ավանդույթներին և սովորաբար փոխանցվում է սերնդեսերունդ բանավոր ձևով։'
          )}

          <div class="grid md:grid-cols-3 gap-5 pt-2">
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2.5">
              <h5 class="font-semibold text-base text-[#B84A27]">${trInline('Características principales', 'Հիմնական հատկանիշներ')}</h5>
              <ol class="list-decimal pl-5 space-y-2">
                <li>${trBlock('Anónima: No se conoce a su autor.', 'Անանուն. հեղինակը հայտնի չէ։')}</li>
                <li>${trBlock('Transmisión oral: Se transmite oralmente.', 'Բանավոր փոխանցում. փոխանցվում է բանավոր։')}</li>
                <li>${trBlock('Colectiva: Forma parte de la tradición del pueblo.', 'Կոլեկտիվ. ժողովրդի մշակութային ժառանգության մասն է։')}</li>
                <li>${trBlock('Variable: Puede cambiar con el tiempo.', 'Փոփոխական. ժամանակի ընթացքում կարող է փոփոխվել։')}</li>
                <li>${trBlock('Lenguaje sencillo: Suele utilizar un lenguaje fácil de recordar.', 'Պարզ լեզու. հաճախ օգտագործում է պարզ, հիշվող լեզու։')}</li>
              </ol>
            </div>

            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2.5">
              <h5 class="font-semibold text-base text-[#B84A27]">${trInline('Ejemplos', 'Օրինակներ')}</h5>
              <ul class="list-disc pl-5 space-y-2">
                <li>${trBlock('Canciones populares', 'Ժողովրդական երգեր')}</li>
                <li>${trBlock('Romances tradicionales', 'Ավանդական ռոմանսներ')}</li>
                <li>${trBlock('Leyendas', 'Ավանդազրույցներ')}</li>
                <li>${trBlock('Mitos tradicionales', 'Ավանդական առասպելներ')}</li>
                <li>${trBlock('Cuentos populares', 'Ժողովրդական հեքիաթներ')}</li>
                <li>${trBlock('Coplas y villancicos tradicionales', 'Ժողովրդական քառյակներ և Սուրբծննդյան երգեր')}</li>
              </ul>
            </div>

            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2.5">
              <h5 class="font-semibold text-base text-[#B84A27]">${trInline('Recursos frecuentes', 'Հաճախ հանդիպող միջոցներ')}</h5>
              <ul class="list-disc pl-5 space-y-2">
                <li>${trBlock('Repeticiones', 'Կրկնություններ')}</li>
                <li>${trBlock('Expresiones coloquiales', 'Խոսակցական արտահայտություններ')}</li>
                <li>${trBlock('Onomatopeyas', 'Ձայնարկություններ / ձայնի նմանակումներ')}</li>
                <li>${trBlock('Llamadas de atención', 'Ուշադրություն գրավող արտահայտություններ')}</li>
                <li>${trBlock('Ritmo y musicalidad', 'Ռիթմ և երաժշտականություն')}</li>
              </ul>
            </div>
          </div>

          <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-lg p-4">
            ${trBlock('<strong>Ejemplo:</strong> ¡Escuchad, amigos, lo que pasó aquella noche!', 'Լսե՛ք, ընկերնե՛ր, թե ինչ պատահեց այդ գիշեր։')}
          </div>
        </div>

        <div class="space-y-4 pt-3 border-t border-[#E5D9C8]">
          <h4 class="text-xl font-semibold text-[#231914]">B. ${trInline('La literatura culta', 'Հեղինակային գրականություն')}</h4>
          ${trBlock(
            'La literatura culta es creada normalmente por un autor conocido y se transmite principalmente por escrito.',
            'Հեղինակային գրականությունը սովորաբար ստեղծվում է հայտնի հեղինակի կողմից և հիմնականում տարածվում է գրավոր ձևով։'
          )}
          <h5 class="font-semibold text-base text-[#B84A27]">${trInline('Características principales', 'Հիմնական հատկանիշներ')}</h5>
          <ol class="list-decimal pl-6 space-y-2">
            <li>${trBlock('Autor conocido: Se conoce quién escribió la obra.', 'Հայտնի հեղինակ. հայտնի է ստեղծագործության հեղինակը։')}</li>
            <li>${trBlock('Transmisión escrita: Se conserva en textos escritos.', 'Գրավոր փոխանցում. պահպանվում է գրավոր տեքստերով։')}</li>
            <li>${trBlock('Elaboración cuidadosa: El autor trabaja el vocabulario y la estructura.', 'Մանրակրկիտ մշակում. հեղինակը մշակում է բառապաշարն ու կառուցվածքը։')}</li>
            <li>${trBlock('Texto relativamente fijo: La obra suele mantenerse en la forma elegida por el autor.', 'Հաստատուն տեքստ. ստեղծագործությունը պահպանվում է հեղինակի ընտրած ձևով։')}</li>
          </ol>

          <div class="overflow-x-auto border border-[#E5D9C8] rounded-lg">
            <table class="study-table">
              <thead>
                <tr>
                  <th>Literatura popular</th>
                  <th>Literatura culta</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${trBlock('Autor generalmente anónimo', 'Հեղինակը սովորաբար անանուն է')}</td>
                  <td>${trBlock('Autor conocido', 'Հայտնի հեղինակ')}</td>
                </tr>
                <tr>
                  <td>${trBlock('Transmisión tradicionalmente oral', 'Ավանդաբար բանավոր փոխանցում')}</td>
                  <td>${trBlock('Transmisión principalmente escrita', 'Հիմնականում գրավոր փոխանցում')}</td>
                </tr>
                <tr>
                  <td>${trBlock('Puede tener diferentes versiones', 'Կարող է ունենալ տարբեր տարբերակներ')}</td>
                  <td>${trBlock('Suele conservar una versión fijada por el autor', 'Սովորաբար պահպանում է հեղինակի ամրագրած տարբերակը')}</td>
                </tr>
                <tr>
                  <td>${trBlock('Lenguaje generalmente sencillo', 'Սովորաբար պարզ լեզու')}</td>
                  <td>${trBlock('Lenguaje más elaborado', 'Ավելի մշակված լեզու')}</td>
                </tr>
                <tr>
                  <td>${trBlock('Forma parte de una tradición colectiva', 'Կոլեկտիվ ավանդույթի մաս է')}</td>
                  <td>${trBlock('Creación individual identificable', 'Անհատական ճանաչելի ստեղծագործություն')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-lg p-5 space-y-2">
            ${trBlock('<strong>Pregunta importante:</strong> ¿Un cuento pertenece siempre a la literatura popular?', 'Պատմվածքը կամ հեքիաթը միշտ ժողովրդակա՞ն գրականություն է։')}
            ${trBlock('No. Un cuento puede ser popular si pertenece a la tradición oral, o culto si tiene un autor conocido.', 'Ո՛չ։ Հեքիաթը կարող է լինել ժողովրդական՝ եթե պատկանում է բանավոր ավանդույթին, կամ հեղինակային՝ եթե ունի հայտնի հեղինակ։')}
          </div>
        </div>
      </article>

      <!-- 5. Los grandes géneros literarios -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-6">
        <h3 class="text-2xl sm:text-3xl font-bold text-[#231914]">5. ${trInline('Los grandes géneros literarios', 'Գրականության երեք հիմնական սեռերը')}</h3>
        <p class="text-base text-[#5C4B40]">Важно не только запомнить три названия, но и уметь определять род литературы, читая текст.</p>

        <div class="border border-[#E5D9C8] rounded-lg p-5 bg-[#FAF6F0]">
          <p class="text-sm font-semibold text-[#B84A27] mb-3">GÉNEROS LITERARIOS</p>
          <div class="grid sm:grid-cols-3 gap-4">
            <div class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-lg p-4 space-y-1">
              ${trBlock('<strong>Lírico</strong>', 'Քնարական')}
              ${trBlock('Expresa sentimientos', 'Արտահայտում է զգացմունքներ')}
            </div>
            <div class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-lg p-4 space-y-1">
              ${trBlock('<strong>Narrativo</strong>', 'Պատմողական')}
              ${trBlock('Cuenta historias', 'Պատմում է պատմություններ')}
            </div>
            <div class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-lg p-4 space-y-1">
              ${trBlock('<strong>Teatral</strong>', 'Թատերական')}
              ${trBlock('Representa acciones', 'Ներկայացնում է գործողություններ')}
            </div>
          </div>
        </div>

        <!-- A. Lírico -->
        <div class="space-y-3 pt-2">
          <h4 class="text-xl font-semibold text-[#231914]">A. ${trInline('Género lírico', 'Քնարական սեռ')}</h4>
          ${trBlock(
            'El género lírico expresa sentimientos, emociones, pensamientos y experiencias personales, normalmente desde un punto de vista subjetivo.',
            'Քնարական սեռը արտահայտում է զգացմունքներ, հույզեր, մտքեր և անձնական ապրումներ՝ հիմնականում սուբյեկտիվ տեսանկյունից։'
          )}
          <p class="text-base font-semibold text-[#231914]">Características:</p>
          <ul class="list-disc pl-6 space-y-1.5">
            <li>${trBlock('Predomina la expresión de sentimientos.', 'Գերակշռում են զգացմունքները։')}</li>
            <li>${trBlock('Frecuentemente se escribe en verso.', 'Հաճախ գրվում է չափածո։')}</li>
            <li>${trBlock('Utiliza ritmo y musicalidad.', 'Օգտագործում է ռիթմ և երաժշտականություն։')}</li>
            <li>${trBlock('Emplea figuras literarias.', 'Օգտագործում է գեղարվեստական արտահայտչամիջոցներ։')}</li>
          </ul>
          <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-lg p-5 space-y-1.5">
            <p class="text-sm font-semibold text-[#B84A27] mb-1">Ejemplo:</p>
            ${trBlock('La mañana me sonríe,', 'Առավոտը ժպտում է ինձ,')}
            ${trBlock('el sol ilumina mi hogar,', 'արևը լուսավորում է իմ տունը,')}
            ${trBlock('y mi corazón se alegra', 'և իմ սիրտը ուրախանում է,')}
            ${trBlock('cuando te veo llegar.', 'երբ տեսնում եմ քեզ գալիս։')}
            <div class="pt-2">
              ${trBlock('<strong>¿Por qué es lírico?</strong> Porque transmite alegría y sentimientos personales.', 'Քնարական է, որովհետև փոխանցում է ուրախություն և անձնական զգացմունքներ։')}
            </div>
          </div>
        </div>

        <!-- B. Narrativo -->
        <div class="space-y-4 pt-3 border-t border-[#E5D9C8]">
          <h4 class="text-xl font-semibold text-[#231914]">B. ${trInline('Género narrativo', 'Պատմողական սեռ')}</h4>
          ${trBlock(
            'El género narrativo cuenta una historia real o ficticia mediante un narrador. Normalmente aparecen personajes, acontecimientos, un lugar y un tiempo.',
            'Պատմողական սեռը պատմում է իրական կամ հորինված պատմություն՝ պատմողի միջոցով։ Սովորաբար կան հերոսներ, իրադարձություններ, վայր և ժամանակ։'
          )}

          <h5 class="text-base font-semibold text-[#B84A27]">${trInline('Elementos narrativos', 'Պատմողական տարրեր')}</h5>
          <div class="overflow-x-auto border border-[#E5D9C8] rounded-lg">
            <table class="study-table">
              <thead>
                <tr><th>Español (нажми для перевода)</th></tr>
              </thead>
              <tbody>
                <tr><td>${trBlock('Narrador', 'Պատմող')}</td></tr>
                <tr><td>${trBlock('Personajes', 'Կերպարներ')}</td></tr>
                <tr><td>${trBlock('Protagonista', 'Գլխավոր հերոս')}</td></tr>
                <tr><td>${trBlock('Espacio', 'Գործողության վայր')}</td></tr>
                <tr><td>${trBlock('Tiempo', 'Գործողության ժամանակ')}</td></tr>
                <tr><td>${trBlock('Argumento', 'Սյուժե')}</td></tr>
                <tr><td>${trBlock('Inicio o planteamiento', 'Սկիզբ / նախադրություն')}</td></tr>
                <tr><td>${trBlock('Nudo', 'Հանգույց / իրադարձությունների զարգացում')}</td></tr>
                <tr><td>${trBlock('Desenlace', 'Ավարտ / հանգուցալուծում')}</td></tr>
              </tbody>
            </table>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2.5">
              <h5 class="text-base font-semibold text-[#B84A27]">${trInline('Tipos de narrador', 'Պատմողի տեսակներ')}</h5>
              <ul class="list-disc pl-5 space-y-2">
                <li>${trBlock('Primera persona: Yo abrí la puerta y encontré una carta.', 'Առաջին դեմք. Ես բացեցի դուռը և գտա մի նամակ (պատմողը խոսում է «ես»-ով)։')}</li>
                <li>${trBlock('Tercera persona: Laura abrió la puerta y encontró una carta.', 'Երրորդ դեմք. Լաուրան բացեց դուռը և գտա մի նամակ (պատմողը խոսում է «նա»-ով)։')}</li>
              </ul>
              ${trBlock('Puede haber narradores protagonistas, testigos y narradores externos.', 'Պատմողը կարող է լինել գլխավոր հերոսը, ականատեսը կամ արտաքին պատմողը։')}
            </div>

            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2.5">
              <h5 class="text-base font-semibold text-[#B84A27]">Estructura narrativa</h5>
              <ol class="list-decimal pl-5 space-y-2">
                <li>
                  ${trBlock('<strong>Planteamiento:</strong> Se presentan los personajes, el lugar y la situación inicial.', 'Սկիզբ․ ներկայացվում են կերպարները, վայրը և նախնական իրավիճակը։')}
                </li>
                <li>
                  ${trBlock('<strong>Nudo:</strong> Aparece un problema o acontecimiento que cambia la situación.', 'Հանգույց․ առաջանում է խնդիր կամ իրադարձություն, որը փոխում է իրավիճակը։')}
                </li>
                <li>
                  ${trBlock('<strong>Desenlace:</strong> La historia llega a su resolución.', 'Հանգուցալուծում․ պատմությունը հասնում է իր լուծմանը։')}
                </li>
              </ol>
            </div>
          </div>
        </div>

        <!-- C. Teatral -->
        <div class="space-y-4 pt-3 border-t border-[#E5D9C8]">
          <h4 class="text-xl font-semibold text-[#231914]">C. ${trInline('Género teatral o dramático', 'Թատերական սեռ')}</h4>
          ${trBlock(
            'El género teatral presenta una acción destinada normalmente a ser representada por actores ante un público.',
            'Թատերական սեռը ներկայացնում է գործողություն, որը սովորաբար նախատեսված է դերասանների կողմից հանդիսատեսի առջև բեմադրելու համար։'
          )}
          <p class="text-base font-semibold text-[#231914]">Características:</p>
          <ul class="list-disc pl-6 space-y-1.5">
            <li>${trBlock('Predomina el diálogo.', 'Գերակշռում է երկխոսությունը։')}</li>
            <li>${trBlock('Normalmente no hay narrador.', 'Սովորաբար պատմող չկա։')}</li>
            <li>${trBlock('Aparecen personajes que hablan.', 'Կան խոսող կերպարներ։')}</li>
            <li>${trBlock('Puede incluir acotaciones.', 'Կարող է ներառել բեմական ցուցումներ։')}</li>
            <li>${trBlock('Se representa en un escenario.', 'Բեմադրվում է բեմի վրա։')}</li>
          </ul>

          <h5 class="text-base font-semibold text-[#B84A27]">${trInline('Elementos del teatro', 'Թատրոնի տարրեր')}</h5>
          <div class="overflow-x-auto border border-[#E5D9C8] rounded-lg">
            <table class="study-table">
              <thead>
                <tr><th>Elemento</th><th>Explicación</th></tr>
              </thead>
              <tbody>
                <tr><td class="font-medium">${trInline('Diálogo', 'Երկխոսություն')}</td><td>${trBlock('Conversación entre personajes', 'Զրույց կերպարների միջև')}</td></tr>
                <tr><td class="font-medium">${trInline('Acotación', 'Բեմական ցուցում')}</td><td>${trBlock('Indicación sobre movimientos, gestos, tono o escenario', 'Շարժումների, ժեստերի, տոնի կամ բեմի վերաբերյալ ցուցում')}</td></tr>
                <tr><td class="font-medium">${trInline('Acto', 'Գործողության հիմնական բաժին')}</td><td>${trBlock('División principal de una obra', 'Ստեղծագործության հիմնական բաժանում')}</td></tr>
                <tr><td class="font-medium">${trInline('Escena', 'Տեսարան')}</td><td>${trBlock('Unidad o parte de la acción teatral', 'Թատերական գործողության միավոր կամ մաս')}</td></tr>
                <tr><td class="font-medium">${trInline('Decorado', 'Բեմի ձևավորում')}</td><td>${trBlock('Elementos visuales del escenario', 'Բեմի տեսողական տարրեր')}</td></tr>
                <tr><td class="font-medium">${trInline('Vestuario', 'Բեմական հագուստ')}</td><td>${trBlock('Ropa de los personajes', 'Կերպարների հագուստ')}</td></tr>
              </tbody>
            </table>
          </div>

          <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-lg p-5 space-y-2">
            <p class="text-sm font-semibold text-[#B84A27]">Ejemplo:</p>
            ${trBlock('[En un jardín. Marta está buscando su cuaderno.]', '[Այգում։ Մարտան փնտրում է իր տետրը։]')}
            ${trBlock('<strong>MARTA:</strong> Pablo, ¿has visto mi cuaderno?', 'ՄԱՐՏԱ․ Պաբլո՛, տեսե՞լ ես իմ տետրը։')}
            ${trBlock('<strong>PABLO:</strong> Sí, está sobre la mesa.', 'ՊԱԲԼՈ․ Այո՛, սեղանի վրա է։')}
            ${trBlock('<strong>MARTA:</strong> ¡Muchas gracias!', 'ՄԱՐՏԱ․ Շատ շնորհակալություն։')}
            ${trBlock('[Marta sonríe y recoge el cuaderno.]', '[Մարտան ժպտում է և վերցնում տետրը։]')}
            <div class="pt-2">
              ${trBlock('<strong>¿Por qué es teatral?</strong> Porque la historia se desarrolla mediante diálogos y acotaciones.', 'Թատերական է, որովհետև պատմությունը զարգանում է երկխոսությունների և բեմական ցուցումների միջոցով։')}
            </div>
          </div>

          <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-lg p-5 space-y-2">
            ${trBlock('<strong>Pregunta típica:</strong> ¿Qué diferencia hay entre un texto narrativo y uno teatral?', 'Ի՞նչ տարբերություն կա պատմողական և թատերական տեքստերի միջև։')}
            ${trBlock('<strong>Respuesta:</strong> El narrativo cuenta una historia mediante un narrador, mientras que el teatral presenta la acción principalmente mediante los diálogos de los personajes.', 'Պատմողական տեքստում պատմությունը ներկայացվում է պատմողի միջոցով, իսկ թատերականում գործողությունը հիմնականում բացահայտվում է հերոսների երկխոսություններով։')}
          </div>
        </div>
      </article>

      <!-- 6. El romance -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-5">
        <h3 class="text-2xl sm:text-3xl font-bold text-[#231914]">6. ${trInline('El romance', 'Իսպանական ավանդական ռոմանս')}</h3>
        <p class="text-base text-[#5C4B40]">На экзамене часто дают стихотворение и просят определить: <em>¿Es un romance? Justifica tu respuesta.</em></p>
        ${trBlock(
          'El romance es una composición poética formada por una serie indefinida de versos octosílabos, con rima asonante en los versos pares y versos impares sueltos.',
          'Ռոմանսը բանաստեղծական տեսակ է, որը կազմված է անորոշ թվով ութվանկանի տողերից։ Զույգ տողերն ունեն ձայնավորային հանգ, իսկ կենտ տողերը չեն հանգավորվում։'
        )}

        <h4 class="text-base font-semibold text-[#B84A27]">Características fundamentales</h4>
        <div class="overflow-x-auto border border-[#E5D9C8] rounded-lg">
          <table class="study-table">
            <thead>
              <tr><th>Concepto</th><th>Explicación (нажми для перевода)</th></tr>
            </thead>
            <tbody>
              <tr><td>${trBlock('Versos octosílabos', 'Ութվանկանի տողեր')}</td><td>${trBlock('Cada verso tiene 8 sílabas métricas.', 'Յուրաքանչյուր տողը՝ 8 չափական վանկ')}</td></tr>
              <tr><td>${trBlock('Versos pares', 'Զույգ տողեր')}</td><td>${trBlock('Versos 2, 4, 6, 8...', 'Զույգ տողեր՝ 2, 4, 6, 8...')}</td></tr>
              <tr><td>${trBlock('Rima asonante', 'Ձայնավորային հանգ')}</td><td>${trBlock('Coinciden las vocales desde la última vocal acentuada.', 'Վերջին շեշտված ձայնավորից սկսած ձայնավորներն են համընկնում')}</td></tr>
              <tr><td>${trBlock('Versos impares sueltos', 'Ազատ կենտ տողեր')}</td><td>${trBlock('Los versos impares no tienen rima obligatoria.', 'Կենտ տողերը չունեն պարտադիր հանգ')}</td></tr>
              <tr><td>${trBlock('Número indefinido', 'Անորոշ քանակ')}</td><td>${trBlock('La cantidad de versos no es fija.', 'Տողերի քանակը հստակ սահմանված չէ')}</td></tr>
            </tbody>
          </table>
        </div>

        <h4 class="text-base font-semibold text-[#B84A27]">Ejemplo de un romance creado para practicar:</h4>
        <div class="overflow-x-auto border border-[#E5D9C8] rounded-lg">
          <table class="study-table">
            <thead>
              <tr><th>Versos</th><th>Métrica / rima</th></tr>
            </thead>
            <tbody>
              <tr><td>${trBlock('Una niña mira el cielo,', 'Մի աղջիկ նայում է երկնքին,')}</td><td class="font-mono-num">8 —</td></tr>
              <tr><td>${trBlock('desde la puerta de casa.', 'տան դռնից։')}</td><td class="font-mono-num">8 a</td></tr>
              <tr><td>${trBlock('Una estrella le sonríe', 'Մի աստղ ժպտում է նրան,')}</td><td class="font-mono-num">8 —</td></tr>
              <tr><td>${trBlock('y la luna la acompaña.', 'և լուսինը ուղեկցում է նրան։')}</td><td class="font-mono-num">8 a</td></tr>
            </tbody>
          </table>
        </div>

        <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-lg p-5 space-y-2">
          ${trBlock(
            'Casa / acompaña: rima asonante a-a. En el primer y tercer verso se aplican sinalefas para obtener ocho sílabas métricas.',
            'Casa / acompaña՝ ձայնավորային հանգ a-a։ Առաջին և երրորդ տողերում կիրառվում է սինալեֆա՝ ութ չափական վանկ ստանալու համար։'
          )}
          ${trBlock(
            '<strong>¿Por qué es un ejemplo de romance?</strong> Porque los versos son octosílabos, los pares presentan rima asonante y los impares quedan sueltos.',
            'Որովհետև տողերն ութվանկանի են, զույգ տողերն ունեն ձայնավորային հանգ, իսկ կենտերը՝ ազատ։'
          )}
        </div>

        <div class="grid md:grid-cols-2 gap-5">
          <div class="border border-[#E5D9C8] rounded-lg p-5 space-y-2.5">
            <h4 class="font-semibold text-lg text-[#231914]">${trInline('¿Cómo contar las sílabas métricas?', 'Ինչպե՞ս հաշվել վանկերը։')}</h4>
            <ol class="list-decimal pl-5 space-y-1.5">
              <li>${trBlock('Separa las sílabas de cada verso.', 'Բաժանիր տողի վանկերը։')}</li>
              <li>${trBlock('Busca las sinalefas.', 'Գտիր ձայնավորների միացումները։')}</li>
              <li>${trBlock('Comprueba la última palabra.', 'Ստուգիր վերջին բառի շեշտադրությունը։')}</li>
              <li>${trBlock('Cuenta las sílabas métricas.', 'Հաշվիր չափական վանկերը։')}</li>
            </ol>
          </div>

          <div class="border border-[#E5D9C8] rounded-lg p-5 space-y-2.5">
            <h4 class="font-semibold text-lg text-[#231914]">${trInline('La sinalefa', 'Սինալեֆա')}</h4>
            ${trBlock(
              'Cuando una palabra termina en vocal y la siguiente empieza en vocal (o h muda seguida de vocal), normalmente pueden formar una sola sílaba métrica.',
              'Երբ մի բառը վերջանում է ձայնավորով, իսկ հաջորդը սկսվում է ձայնավորով (կամ համր h-ով ու ձայնավորով), սովորաբար դրանք կազմում են մեկ չափական վանկ։'
            )}
            ${trBlock('Ejemplo: Una niña mira el cielo → U-na / ni-ña / mi-ra_el / cie-lo = 8 sílabas métricas.', 'Մի աղջիկ նայում է երկնքին → 8 չափական վանկ (mira_el միանում է)։')}
          </div>
        </div>

        <h4 class="text-base font-semibold text-[#B84A27]">${trInline('La ley del acento final', 'Վերջին շեշտի կանոնը')}</h4>
        <div class="overflow-x-auto border border-[#E5D9C8] rounded-lg">
          <table class="study-table">
            <thead>
              <tr><th>Final del verso</th><th>Regla</th></tr>
            </thead>
            <tbody>
              <tr><td>${trBlock('Palabra aguda', 'Վերջին վանկում շեշտված բառ')}</td><td>${trBlock('Se suma 1', 'Ավելացնում ենք 1')}</td></tr>
              <tr><td>${trBlock('Palabra llana', 'Նախավերջին վանկում շեշտված բառ')}</td><td>${trBlock('No cambia', 'Չի փոխվում')}</td></tr>
              <tr><td>${trBlock('Palabra esdrújula', 'Վերջից երրորդ վանկում շեշտված բառ')}</td><td>${trBlock('Se resta 1', 'Հանում ենք 1')}</td></tr>
            </tbody>
          </table>
        </div>
        <ul class="list-disc pl-6 space-y-1.5">
          <li>${trBlock('Mi corazón quiere cantar — «cantar» es aguda, por eso se añade una sílaba métrica al cómputo.', 'Իմ սիրտը ուզում է երգել — «cantar»-ը aguda է, ուստի ավելանում է մեկ չափական վանկ։')}</li>
          <li>${trBlock('La niña observa la luna — «luna» es llana, no se añade ni se resta.', 'Աղջիկը նայում է լուսնին — «luna»-ն llana է, չի ավելանում և չի հանվում։')}</li>
          <li>${trBlock('Escucho un canto mágico — «mágico» es esdrújula, por eso se resta una sílaba métrica.', 'Լսում եմ կախարդական երգ — «mágico»-ն esdrújula է, ուստի հանվում է մեկ չափական վանկ։')}</li>
        </ul>
        <p class="text-base text-[#5C4B40] italic">Важно: сначала учитываются обычные слоги и sinalefas, а затем применяется правило последнего ударения. Данные примеры показывают правило, а не обязательно восьмисложные строки.</p>

        <div class="border border-[#E5D9C8] rounded-lg p-5 space-y-2.5 bg-[#FAF6F0]">
          <h4 class="font-semibold text-lg text-[#231914]">${trInline('Rima consonante y asonante', 'Բաղաձայնային և ձայնավորային հանգ')}</h4>
          ${trBlock('<strong>Rima consonante:</strong> Coinciden todos los sonidos desde la última vocal acentuada. (corazón — canción)', 'Համընկնում են բոլոր հնչյունները՝ վերջին շեշտված ձայնավորից սկսած։')}
          ${trBlock('<strong>Rima asonante:</strong> Coinciden solo las vocales desde la última vocal acentuada. (casa — rama)', 'Համընկնում են միայն ձայնավորները՝ վերջին շեշտված ձայնավորից սկսած (a-a)։')}
          ${trBlock('<strong>Muy importante:</strong> No basta con que un poema tenga ocho sílabas para llamarlo romance. También hay que comprobar el esquema de la rima.', 'Բավական չէ, որ բանաստեղծությունը ունենա ութ վանկ՝ այն ռոմանս կոչելու համար․ պետք է ստուգել նաև հանգավորման սխեման։')}
        </div>
      </article>

      <!-- 7. La leyenda, el mito y el cuento -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-5">
        <h3 class="text-2xl sm:text-3xl font-bold text-[#231914]">7. ${trInline('La leyenda, el mito y el cuento', 'Ավանդազրույց, առասպել և պատմվածք')}</h3>
        <div class="grid md:grid-cols-3 gap-5">
          <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2.5">
            <h4 class="font-semibold text-lg text-[#231914]">${trInline('La leyenda', 'Ավանդազրույց')}</h4>
            ${trBlock('La leyenda es una narración tradicional que se relaciona con lugares, personajes o hechos reales, pero incorpora elementos imaginarios o fantásticos.', 'Ավանդազրույցը ավանդական պատմություն է, որը կապված է իրական վայրերի, մարդկանց կամ դեպքերի հետ, բայց ներառում է երևակայական կամ ֆանտաստիկ տարրեր։')}
            <ul class="list-disc pl-5 space-y-1.5">
              <li>${trBlock('Tiene una base real o histórica.', 'Ունի իրական կամ պատմական հիմք։')}</li>
              <li>${trBlock('Incluye elementos fantásticos.', 'Պարունակում է ֆանտաստիկ տարրեր։')}</li>
              <li>${trBlock('Se transmite por tradición.', 'Փոխանցվում է ավանդույթի միջոցով։')}</li>
              <li>${trBlock('Puede explicar el origen de un lugar o una costumbre.', 'Կարող է բացատրել վայրի կամ սովորույթի ծագումը։')}</li>
            </ul>
            ${trBlock('<strong>Ejemplo:</strong> Una leyenda sobre una fuente antigua cuya agua, según los habitantes, concede deseos.', 'Օրինակ՝ ավանդազրույց մի հին աղբյուրի մասին, որի ջուրը, բնակիչների խոսքով, կատարում է ցանկություններ։')}
          </div>

          <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2.5">
            <h4 class="font-semibold text-lg text-[#231914]">${trInline('El mito', 'Առասպել')}</h4>
            ${trBlock('El mito es una narración tradicional y simbólica que suele explicar el origen del mundo, de los seres humanos o de fenómenos naturales mediante dioses, héroes o seres sobrenaturales.', 'Առասպելը ավանդական և խորհրդանշական պատմություն է, որը հաճախ բացատրում է աշխարհի, մարդկության կամ բնության երևույթների ծագումը՝ աստվածների, հերոսների կամ գերբնական էակների միջոցով։')}
            <p class="font-semibold text-[#B84A27] pt-1">Ejemplos de temas:</p>
            <ul class="list-disc pl-5 space-y-1.5">
              <li>${trBlock('El origen del sol', 'Արևի ծագումը')}</li>
              <li>${trBlock('La creación del mundo', 'Աշխարհի ստեղծումը')}</li>
              <li>${trBlock('El origen de las estaciones', 'Տարվա եղանակների ծագումը')}</li>
            </ul>
          </div>

          <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2.5">
            <h4 class="font-semibold text-lg text-[#231914]">${trInline('El cuento', 'Պատմվածք / հեքիաթ')}</h4>
            ${trBlock('El cuento es una narración breve, generalmente ficticia, con pocos personajes y un argumento sencillo.', 'Պատմվածքը կարճ պատմողական ստեղծագործություն է, սովորաբար հորինված, քիչ կերպարներով և պարզ սյուժեով։')}
            <p class="font-semibold text-[#B84A27] pt-1">Características:</p>
            <ul class="list-disc pl-5 space-y-1.5">
              <li>${trBlock('Brevedad', 'Կարճություն')}</li>
              <li>${trBlock('Pocos personajes', 'Քիչ հերոսներ')}</li>
              <li>${trBlock('Argumento sencillo', 'Պարզ սյուժե')}</li>
              <li>${trBlock('Planteamiento, nudo y desenlace', 'Սկիզբ, հանգույց և ավարտ')}</li>
            </ul>
          </div>
        </div>

        <div class="overflow-x-auto border border-[#E5D9C8] rounded-lg">
          <table class="study-table">
            <thead>
              <tr><th>Tipo</th><th>¿Qué lo caracteriza?</th></tr>
            </thead>
            <tbody>
              <tr><td class="font-medium">Romance</td><td>${trBlock('Poema octosilábico con rima asonante en versos pares', 'Ութվանկանի չափածո՝ զույգ տողերում ձայնավորային հանգով')}</td></tr>
              <tr><td class="font-medium">Leyenda</td><td>${trBlock('Realidad y fantasía mezcladas', 'Իրականության և երևակայության միավորում')}</td></tr>
              <tr><td class="font-medium">Mito</td><td>${trBlock('Explicación simbólica con seres sobrenaturales', 'Խորհրդանշական պատմություն գերբնական էակներով')}</td></tr>
              <tr><td class="font-medium">Cuento</td><td>${trBlock('Narración breve con argumento sencillo', 'Կարճ պատմություն պարզ սյուժեով')}</td></tr>
            </tbody>
          </table>
        </div>
      </article>

      <!-- 8. Las figuras literarias -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-6">
        <h3 class="text-2xl sm:text-3xl font-bold text-[#231914]">8. ${trInline('Las figuras literarias', 'Գրական արտահայտչամիջոցներ')}</h3>
        <p class="text-base text-[#5C4B40]">Важное деление на три уровня: <strong>nivel fónico</strong>, <strong>nivel morfosintáctico</strong> y <strong>nivel semántico</strong>. На экзамене нужно найти приём, назвать его уровень и объяснить эффект.</p>

        <!-- A. Nivel fónico -->
        <div class="space-y-3">
          <h4 class="text-xl font-semibold text-[#B84A27]">A. ${trInline('Nivel fónico', 'Հնչյունային մակարդակ')}</h4>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2">
              <p class="font-semibold text-lg text-[#231914]">1. ${trInline('Aliteración', 'Հնչյունների կրկնություն')}</p>
              ${trBlock('Repetición de sonidos iguales o semejantes para producir un efecto sonoro.', 'Նման կամ նույն հնչյունների կրկնություն՝ հատուկ հնչողություն ստեղծելու նպատակով։')}
              ${trBlock('<em>Sus suaves susurros sonaban en silencio.</em>', 'Նրա մեղմ շշուկները հնչում էին լռության մեջ (կրկնվում է «s» հնչյունը)։')}
            </div>
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2">
              <p class="font-semibold text-lg text-[#231914]">2. ${trInline('Onomatopeya', 'Ձայնի նմանակում')}</p>
              ${trBlock('Palabra que imita un sonido real.', 'Բառ, որը նմանակում է իրական ձայն։')}
              <ul class="list-disc pl-5 text-sm space-y-1">
                <li>${trInline('Miau', 'Կատվի մլավոց')}</li>
                <li>${trInline('Guau', 'Շան հաչոցի նմանակում')}</li>
                <li>${trInline('Tic-tac', 'Ժամացույցի ձայն')}</li>
                <li>${trInline('Pum', 'Հարվածի ձայն')}</li>
              </ul>
            </div>
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2">
              <p class="font-semibold text-lg text-[#231914]">3. ${trInline('Paronomasia', 'Համանման հնչողությամբ բառերի խաղ')}</p>
              ${trBlock('Utilización cercana de palabras con sonidos parecidos, pero significados diferentes.', 'Իրար մոտ օգտագործվում են նման հնչողություն ունեցող, բայց տարբեր նշանակությամբ բառեր։')}
              ${trBlock('<em>El hombre no se cansa de su casa.</em>', 'Մարդը չի հոգնում իր տնից (cansa / casa)։')}
            </div>
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2">
              <p class="font-semibold text-lg text-[#231914]">4. ${trInline('Epanadiplosis', 'Կրկնություն տողի սկզբում և վերջում')}</p>
              ${trBlock('Repetición de una palabra al principio y al final de un mismo verso o enunciado.', 'Նույն բառի կրկնություն նույն տողի կամ արտահայտության սկզբում և վերջում։')}
              ${trBlock('<em>Verde, todo el campo es verde.</em>', 'Կանաչ, ամբողջ դաշտը կանաչ է։')}
            </div>
          </div>
        </div>

        <!-- B. Nivel morfosintáctico -->
        <div class="space-y-3 pt-3 border-t border-[#E5D9C8]">
          <h4 class="text-xl font-semibold text-[#B84A27]">B. ${trInline('Nivel morfosintáctico', 'Ձևաբանական և շարահյուսական մակարդակ')}</h4>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2">
              <p class="font-semibold text-lg text-[#231914]">5. ${trInline('Hipérbaton', 'Շարադասության շրջում')}</p>
              ${trBlock('Alteración del orden habitual de las palabras.', 'Բառերի սովորական դասավորության փոփոխություն։')}
              ${trBlock('Orden habitual: Las flores crecen en el jardín. / Hipérbaton: En el jardín crecen las flores.', 'Սովորական՝ Ծաղիկները աճում են այգում։ / Հիպերբատոն՝ Այգում աճում են ծաղիկները։')}
            </div>
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2">
              <p class="font-semibold text-lg text-[#231914]">6. ${trInline('Anáfora', 'Սկզբնական կրկնություն')}</p>
              ${trBlock('Repetición de una o varias palabras al comienzo de versos o enunciados sucesivos.', 'Նույն բառի կամ բառախմբի կրկնություն հաջորդական տողերի սկզբում։')}
              ${trBlock('Quiero un mundo tranquilo. Quiero un mundo alegre. Quiero un mundo mejor.', 'Ուզում եմ խաղաղ աշխարհ։ Ուզում եմ ուրախ աշխարհ։ Ուզում եմ ավելի լավ աշխարհ։')}
            </div>
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2">
              <p class="font-semibold text-lg text-[#231914]">7. ${trInline('Asíndeton', 'Շաղկապների բացթողում')}</p>
              ${trBlock('Enumeración o unión de elementos sin utilizar las conjunciones que normalmente los enlazarían.', 'Թվարկում կամ կապակցում՝ առանց սովորական կապակցող շաղկապների։')}
              ${trBlock('<em>Corre, salta, ríe, juega.</em>', 'Վազում է, ցատկում, ծիծաղում, խաղում (չկա «y» շաղկապ)։')}
            </div>
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2">
              <p class="font-semibold text-lg text-[#231914]">8. ${trInline('Polisíndeton', 'Շաղկապների բազմակի կրկնություն')}</p>
              ${trBlock('Repetición expresiva de conjunciones.', 'Շաղկապների արտահայտիչ, բազմակի կրկնություն։')}
              ${trBlock('<em>Y canta, y ríe, y salta, y sueña.</em>', 'Եվ երգում է, և ծիծաղում, և ցատկում, և երազում։')}
            </div>
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2">
              <p class="font-semibold text-lg text-[#231914]">9. ${trInline('Enumeración', 'Թվարկում')}</p>
              ${trBlock('Presentación sucesiva de elementos relacionados.', 'Մի շարք առարկաների, գործողությունների կամ հատկանիշների հաջորդական թվարկում։')}
              ${trBlock('En la mochila había libros, lápices, cuadernos y colores.', 'Պայուսակում կային գրքեր, մատիտներ, տետրեր և գույներ։')}
              ${trBlock('Diferencia: Compré pan, leche y fruta (Enumeración). Compré pan, leche, fruta, queso (Enumeración con asíndeton).', 'Տարբերությունը․ եթե կա «y»՝ սովորական թվարկում է, եթե չկա «y»՝ թվարկում է շաղկապների բացթողումով (asíndeton)։')}
            </div>
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2">
              <p class="font-semibold text-lg text-[#231914]">10. ${trInline('Pleonasmo', 'Ավելորդ, բայց արտահայտիչ կրկնություն')}</p>
              ${trBlock('Uso de palabras aparentemente innecesarias que refuerzan una idea.', 'Իմաստով ավելորդ թվացող բառերի օգտագործում՝ միտքն ընդգծելու նպատակով։')}
              ${trBlock('<em>Lo vi con mis propios ojos.</em>', 'Ես դա տեսա իմ սեփական աչքերով։')}
              ${trBlock('Atención: En muchos contextos cotidianos, algunas expresiones pleonásticas no son un recurso literario intencionado, sino una forma habitual de hablar.', 'Ուշադրություն․ առօրյա խոսքում որոշ ավելորդ կրկնություններ պարզապես սովորական խոսելաձև են, ոչ թե գրական հատուկ հնարք։')}
            </div>
          </div>
        </div>

        <!-- C. Nivel semántico -->
        <div class="space-y-3 pt-3 border-t border-[#E5D9C8]">
          <h4 class="text-xl font-semibold text-[#B84A27]">C. ${trInline('Nivel semántico', 'Իմաստային մակարդակ')}</h4>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2.5 md:col-span-2">
              <p class="font-semibold text-lg text-[#231914]">11. ${trInline('Metáfora', 'Փոխաբերություն')}</p>
              ${trBlock('Identificación de un elemento real con otro imaginario por una semejanza entre ambos.', 'Իրական մի առարկայի կամ երևույթի նույնացում մեկ այլ պատկերի հետ՝ նրանց նմանության հիման վրա։')}
              ${trBlock('<em>Tus ojos son dos estrellas.</em>', 'Քո աչքերը երկու աստղ են (աչքերը համեմատվում են աստղերի հետ՝ առանց «como» բառի)։')}
              <div class="overflow-x-auto border border-[#E5D9C8] rounded-lg mt-2">
                <table class="study-table">
                  <thead><tr><th>Forma</th><th>Ejemplo</th><th>Explicación</th></tr></thead>
                  <tbody>
                    <tr><td>A es B</td><td>${trBlock('Tus ojos son estrellas.', 'Քո աչքերը աստղեր են։')}</td><td>${trBlock('Se nombran el elemento real y el imaginario.', 'Հայտնի են և՛ իրական, և՛ պատկերավոր տարրերը')}</td></tr>
                    <tr><td>B sustituye a A</td><td>${trBlock('Dos estrellas me miran.', 'Երկու աստղ նայում են ինձ։')}</td><td>${trBlock('Falta el elemento real, sustituido por el imaginario.', 'Իրական տարրը բացակայում է, այն փոխարինվում է պատկերավորով')}</td></tr>
                    <tr><td>B de A</td><td>${trBlock('El fuego de tu mirada.', 'Քո հայացքի կրակը։')}</td><td>${trBlock('El elemento imaginario se une al real mediante «de».', 'Պատկերավոր տարրը կապվում է իրականի հետ «de»-ով')}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2">
              <p class="font-semibold text-lg text-[#231914]">12. ${trInline('Símil o comparación', 'Համեմատություն')}</p>
              ${trBlock('Comparación explícita entre dos elementos mediante palabras como «como», «parece» o «igual que».', 'Երկու առարկայի բացահայտ համեմատություն՝ օգտագործելով «como», «parece», «igual que» և այլն։')}
              ${trBlock('Sus manos son suaves como la seda. (Metáfora: Sus manos son seda.)', 'Նրա ձեռքերը մետաքսի պես փափուկ են։ (Փոխաբերություն՝ Նրա ձեռքերը մետաքս են։)')}
            </div>
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2">
              <p class="font-semibold text-lg text-[#231914]">13. ${trInline('Personificación', 'Անձնավորում')}</p>
              ${trBlock('Atribución de características, acciones o sentimientos humanos a animales, objetos o fenómenos naturales.', 'Մարդկային գործողությունների, հատկանիշների կամ զգացմունքների վերագրում կենդանիներին, առարկաներին կամ բնության երևույթներին։')}
              ${trBlock('El viento canta entre los árboles. / La luna sonríe a los niños.', 'Քամին երգում է ծառերի մեջ։ / Լուսինը ժպտում է երեխաներին։')}
            </div>
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2">
              <p class="font-semibold text-lg text-[#231914]">14. ${trInline('Hipérbole', 'Չափազանցություն')}</p>
              ${trBlock('Exageración intencionada para dar mayor intensidad a una expresión.', 'Գիտակցված չափազանցություն՝ միտքն ավելի ուժեղ ներկայացնելու նպատակով։')}
              ${trBlock('Te he llamado mil veces. / Me muero de hambre.', 'Քեզ հազար անգամ եմ զանգել։ / Սովից մեռնում եմ։')}
            </div>
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2">
              <p class="font-semibold text-lg text-[#231914]">15. ${trInline('Antítesis', 'Հակադրություն')}</p>
              ${trBlock('Contraposición de palabras o ideas de significado opuesto.', 'Հակադիր իմաստ ունեցող բառերի կամ գաղափարների հակադրում։')}
              ${trBlock('<em>Unos ríen y otros lloran.</em>', 'Ոմանք ծիծաղում են, իսկ մյուսները՝ լացում։')}
            </div>
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-2 md:col-span-2">
              <p class="font-semibold text-lg text-[#231914]">16. ${trInline('Epíteto', 'Գեղարվեստական մակդիր')}</p>
              ${trBlock('Adjetivo que destaca una cualidad característica del sustantivo.', 'Ածական, որն ընդգծում է գոյականին բնորոշ հատկանիշը։')}
              ${trBlock('<em>La blanca nieve cubría las montañas.</em>', 'Ճերմակ ձյունը ծածկում էր լեռները։')}
            </div>
          </div>
        </div>

        <!-- Resumen para memorizar -->
        <div class="space-y-3 pt-3 border-t border-[#E5D9C8]">
          <h4 class="text-lg font-semibold text-[#231914]">${trInline('Resumen para memorizar', 'Հիշելու աղյուսակ')}</h4>
          <div class="overflow-x-auto border border-[#E5D9C8] rounded-lg">
            <table class="study-table">
              <thead><tr><th>Figura</th><th>Pista para reconocerla</th></tr></thead>
              <tbody>
                <tr><td class="font-medium">Aliteración</td><td>${trBlock('Repite sonidos', 'Հնչյունների կրկնություն')}</td></tr>
                <tr><td class="font-medium">Onomatopeya</td><td>${trBlock('Imita sonidos', 'Ձայնի նմանակում')}</td></tr>
                <tr><td class="font-medium">Paronomasia</td><td>${trBlock('Palabras de sonido parecido', 'Նման հնչող բառեր')}</td></tr>
                <tr><td class="font-medium">Epanadiplosis</td><td>${trBlock('Misma palabra al principio y al final', 'Նույն բառը սկզբում և վերջում')}</td></tr>
                <tr><td class="font-medium">Hipérbaton</td><td>${trBlock('Cambia el orden habitual', 'Փոխված շարադասություն')}</td></tr>
                <tr><td class="font-medium">Anáfora</td><td>${trBlock('Repite comienzos', 'Սկզբնական կրկնություն')}</td></tr>
                <tr><td class="font-medium">Asíndeton</td><td>${trBlock('Omite conjunciones', 'Շաղկապների բացթողում')}</td></tr>
                <tr><td class="font-medium">Polisíndeton</td><td>${trBlock('Repite conjunciones', 'Շաղկապների կրկնություն')}</td></tr>
                <tr><td class="font-medium">Enumeración</td><td>${trBlock('Presenta una serie de elementos', 'Թվարկում')}</td></tr>
                <tr><td class="font-medium">Pleonasmo</td><td>${trBlock('Añade palabras redundantes', 'Ավելորդ իմաստային կրկնություն')}</td></tr>
                <tr><td class="font-medium">Metáfora</td><td>${trBlock('Identifica dos elementos', 'Փոխաբերական նույնացում')}</td></tr>
                <tr><td class="font-medium">Símil</td><td>${trBlock('Compara explícitamente', 'Բացահայտ համեմատություն')}</td></tr>
                <tr><td class="font-medium">Personificación</td><td>${trBlock('Da cualidades humanas', 'Մարդկային հատկանիշների վերագրում')}</td></tr>
                <tr><td class="font-medium">Hipérbole</td><td>${trBlock('Exagera', 'Չափազանցնում է')}</td></tr>
                <tr><td class="font-medium">Antítesis</td><td>${trBlock('Contrapone ideas', 'Հակադրում է գաղափարներ')}</td></tr>
                <tr><td class="font-medium">Epíteto</td><td>${trBlock('Destaca una cualidad', 'Ընդգծում է բնորոշ հատկանիշը')}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </article>
    </section>
  `;
}

function renderParteII() {
  return `
    <section id="parte-2" class="section-block space-y-8" data-section="parte-2">
      <div class="border-b border-[#E5D9C8] pb-4">
        <p class="text-sm font-semibold tracking-wide text-[#B84A27] mb-1">PARTE II</p>
        <h2 class="text-3xl sm:text-4xl font-bold text-[#231914]">PARTE II. CÓMO ANALIZAR UN TEXTO</h2>
        <p class="text-base text-[#5C4B40] mt-2">В Испании на уроках <em>Lengua Castellana y Literatura</em> часто встречаются задания типа <em>Lee el texto y responde, Resume el texto, Identifica el narrador, Justifica tu respuesta, Localiza un recurso literario</em>. Важно не просто угадывать ответ, а доказывать его словами из текста.</p>
      </div>

      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-5">
        <h3 class="text-2xl font-bold text-[#231914]">1. ${trInline('¿Cómo escribir un resumen?', 'Ինչպե՞ս գրել ամփոփում։')}</h3>
        ${trBlock(
          'Un resumen es un texto breve que recoge las ideas principales de otro texto sin añadir opiniones personales.',
          'Ամփոփումը կարճ տեքստ է, որը ներկայացնում է բնագրի հիմնական մտքերը՝ առանց անձնական կարծիքներ ավելացնելու։'
        )}

        <h4 class="text-base font-semibold text-[#B84A27]">${trInline('Reglas', 'Կանոններ')}</h4>
        <ol class="list-decimal pl-6 space-y-2">
          <li>${trBlock('Lee el texto completo.', 'Կարդա ամբողջ տեքստը։')}</li>
          <li>${trBlock('Identifica el tema principal.', 'Գտիր հիմնական թեման։')}</li>
          <li>${trBlock('Selecciona los hechos más importantes.', 'Առանձնացրու ամենակարևոր իրադարձությունները։')}</li>
          <li>${trBlock('Elimina los detalles secundarios.', 'Բաց թող երկրորդական մանրամասները։')}</li>
          <li>${trBlock('Escribe con tus propias palabras.', 'Գրիր սեփական բառերով։')}</li>
          <li>${trBlock('Respeta el orden de los acontecimientos.', 'Պահպանիր իրադարձությունների հերթականությունը։')}</li>
          <li>${trBlock('No añadas tu opinión.', 'Մի ավելացրու անձնական կարծիք։')}</li>
        </ol>

        <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-lg p-5 space-y-3">
          <p class="font-semibold text-[#231914]">Ejemplo de resumen:</p>
          <div>
            <p class="text-sm font-semibold text-[#7A6658] mb-1">Texto original:</p>
            ${trBlock('Lucía encontró un perro perdido cerca de su colegio. Como no sabía quién era su dueño, pidió ayuda a su profesora. Juntas llamaron al número que aparecía en el collar del animal. Una hora después, el perro volvió con su familia.', 'Լուսիան իր դպրոցի մոտ կորած շուն գտավ։ Քանի որ չգիտեր՝ ով է նրա տերը, օգնություն խնդրեց ուսուցչուհուց։ Միասին զանգահարեցին կենդանու վզկապին գրված համարով։ Մեկ ժամ անց շունը վերադարձավ իր ընտանիք։')}
          </div>
          <div>
            <p class="text-sm font-semibold text-[#B84A27] mb-1">Resumen:</p>
            ${trBlock('Lucía encuentra un perro perdido y, con ayuda de su profesora, consigue localizar a su familia y devolverlo.', 'Լուսիան գտնում է կորած շուն և ուսուցչուհու օգնությամբ կարողանում է գտնել նրա ընտանիքին ու վերադարձնել շանը։')}
          </div>
        </div>
      </article>

      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-5">
        <h3 class="text-2xl font-bold text-[#231914]">2. ${trInline('¿Cómo responder a las preguntas de análisis?', 'Ինչպե՞ս պատասխանել վերլուծության հարցերին։')}</h3>
        <div class="overflow-x-auto border border-[#E5D9C8] rounded-lg">
          <table class="study-table">
            <thead><tr><th>Pregunta en español (нажми для перевода)</th><th>Что нужно написать</th></tr></thead>
            <tbody>
              <tr><td>${trBlock('¿De qué trata el texto?', 'Ինչի՞ մասին է տեքստը։')}</td><td>О чём текст в 1–2 предложениях</td></tr>
              <tr><td>${trBlock('¿Cuál es el tema principal?', 'Ո՞րն է հիմնական թեման։')}</td><td>Главная идея в краткой формулировке</td></tr>
              <tr><td>${trBlock('¿Quién es el protagonista?', 'Ո՞վ է գլխավոր հերոսը։')}</td><td>Главный герой</td></tr>
              <tr><td>${trBlock('¿Dónde sucede la historia?', 'Որտե՞ղ է տեղի ունենում պատմությունը։')}</td><td>Место действия</td></tr>
              <tr><td>${trBlock('¿Cuándo sucede?', 'Ե՞րբ է տեղի ունենում։')}</td><td>Время действия</td></tr>
              <tr><td>${trBlock('¿Qué tipo de narrador aparece?', 'Ինչպիսի՞ պատմող կա տեքստում։')}</td><td>Рассказчик от 1-го или 3-го лица</td></tr>
              <tr><td>${trBlock('¿Cuál es el conflicto?', 'Ո՞րն է խնդիրը / բախումը։')}</td><td>Какая возникает проблема</td></tr>
              <tr><td>${trBlock('¿Cómo se resuelve el problema?', 'Ինչպե՞ս է լուծվում խնդիրը։')}</td><td>Как решается проблема</td></tr>
              <tr><td>${trBlock('¿Qué enseñanza transmite?', 'Ի՞նչ դաս է փոխանցում։')}</td><td>Какой урок или идею передаёт</td></tr>
              <tr><td>${trBlock('Justifica tu respuesta.', 'Հիմնավորիր պատասխանդ։')}</td><td>Объясни почему и приведи доказательство</td></tr>
            </tbody>
          </table>
        </div>

        <h4 class="text-base font-semibold text-[#B84A27] pt-2">${trInline('Frases útiles para el examen', 'Օգտակար ձևակերպումներ քննության համար')}</h4>
        <ul class="grid md:grid-cols-2 gap-3">
          <li class="border border-[#E5D9C8] rounded-lg p-3.5">${trBlock('El texto trata sobre...', 'Տեքստը վերաբերում է...')}</li>
          <li class="border border-[#E5D9C8] rounded-lg p-3.5">${trBlock('El tema principal es...', 'Հիմնական թեման է...')}</li>
          <li class="border border-[#E5D9C8] rounded-lg p-3.5">${trBlock('El protagonista es...', 'Գլխավոր հերոսն է...')}</li>
          <li class="border border-[#E5D9C8] rounded-lg p-3.5">${trBlock('La historia sucede en...', 'Պատմությունը տեղի է ունենում...')}</li>
          <li class="border border-[#E5D9C8] rounded-lg p-3.5">${trBlock('El narrador está en tercera persona porque...', 'Պատմողը երրորդ դեմքով է, որովհետև...')}</li>
          <li class="border border-[#E5D9C8] rounded-lg p-3.5">${trBlock('En el planteamiento...', 'Սկզբում...')}</li>
          <li class="border border-[#E5D9C8] rounded-lg p-3.5">${trBlock('El problema aparece cuando...', 'Խնդիրն առաջանում է, երբ...')}</li>
          <li class="border border-[#E5D9C8] rounded-lg p-3.5">${trBlock('Finalmente...', 'Վերջում...')}</li>
          <li class="border border-[#E5D9C8] rounded-lg p-3.5">${trBlock('El autor utiliza una personificación porque...', 'Հեղինակը օգտագործում է անձնավորում, որովհետև...')}</li>
          <li class="border border-[#E5D9C8] rounded-lg p-3.5">${trBlock('Podemos comprobarlo en la frase...', 'Դա կարող ենք հաստատել ... արտահայտությամբ։')}</li>
        </ul>
      </article>
    </section>
  `;
}

function renderParteIII() {
  return `
    <section id="parte-3" class="section-block space-y-8" data-section="parte-3">
      <div class="border-b border-[#E5D9C8] pb-4">
        <p class="text-sm font-semibold tracking-wide text-[#B84A27] mb-1">PARTE III</p>
        <h2 class="text-3xl sm:text-4xl font-bold text-[#231914]">PARTE III. EXAMEN DE PRÁCTICA</h2>
        <div class="flex flex-wrap items-center gap-2 text-sm text-[#5C4B40] mt-2">
          <span>Lengua Castellana y Literatura</span>
          <span aria-hidden="true">·</span>
          <span>1.º–2.º ESO</span>
          <span aria-hidden="true">·</span>
          <span>Modelo de examen completo</span>
          <span aria-hidden="true">·</span>
          <span>Duración orientativa: 90–120 min</span>
          <span aria-hidden="true">·</span>
          <span>Sin consultar los apuntes</span>
        </div>
        <p class="text-base text-[#5C4B40] mt-2">Сначала идут задания без ответов. В конце — отдельный solucionario. Нажми на любой испанский текст, чтобы открыть перевод на армянский.</p>
      </div>

      <!-- EJERCICIO 1 -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <p class="text-sm font-semibold text-[#B84A27]">EJERCICIO 1</p>
          <h3 class="text-2xl sm:text-3xl font-bold text-[#231914]">${trInline('Comprensión y análisis de un texto narrativo', 'Պատմողական տեքստի ընթերցում և վերլուծություն')}</h3>
        </div>

        <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-xl p-5 sm:p-6 space-y-3.5">
          <div class="border-b border-[#E5D9C8] pb-3">
            <p class="text-sm text-[#7A6658]">TEXTO ORIGINAL PARA PRACTICAR · Nivel 1.º–2.º ESO (нажми на абзац, чтобы открыть перевод)</p>
            <h4 class="text-xl font-bold text-[#231914] mt-1">${trInline('Lectura: «El secreto del jardín de los libros»', 'Ընթերցանություն․ «Գրքերի այգու գաղտնիքը»')}</h4>
          </div>
          <div class="space-y-3 text-base leading-relaxed text-[#231914]">
            ${EXERCISE_1_TEXT.map((p) => trBlock(escapeHtml(p.es), p.hy)).join('')}
          </div>
        </div>

        <div class="space-y-4">
          <h4 class="text-xl font-semibold text-[#231914]">A. ${trInline('Comprensión lectora', 'Տեքստի ընկալում')}</h4>
          <p class="text-base text-[#5C4B40]">${trInline('Responde con oraciones completas.', 'Պատասխանիր ամբողջական նախադասություններով։')}</p>
          <div class="grid md:grid-cols-2 gap-4">
            ${EXERCISE_1_QUESTIONS.A.map((q) => renderOpenQuestionCard(q, 'ex1')).join('')}
          </div>
        </div>

        <div class="space-y-4 pt-4 border-t border-[#E5D9C8]">
          <h4 class="text-xl font-semibold text-[#231914]">B. ${trInline('Resumen', 'Ամփոփում')}</h4>
          <div class="border border-[#E5D9C8] rounded-xl p-5 space-y-3.5">
            <div class="font-medium text-[#231914]">11. ${trInline(EXERCISE_1_QUESTIONS.B.es, EXERCISE_1_QUESTIONS.B.hy)}</div>
            <textarea
              id="resumen-input"
              rows="5"
              placeholder="Escribe aquí tu resumen en español (70–90 palabras)..."
              class="w-full rounded-lg border border-[#D6C7B2] bg-[#FAF6F0] px-4 py-3 text-base text-[#231914] focus:bg-[#FFFDF9] focus:border-[#B84A27] focus:outline-none"
            ></textarea>
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-3 text-base">
                <span id="resumen-word-count" class="font-mono-num font-semibold text-[#231914]">0 / 70–90 palabras</span>
                <span id="resumen-status" class="text-sm text-[#5C4B40]">Напиши 70–90 слов на испанском</span>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  id="copy-resumen-btn"
                  class="px-4 py-2 text-sm font-semibold rounded-lg border border-[#D6C7B2] bg-[#FFFDF9] text-[#231914] hover:bg-[#F3ECE1] transition-colors cursor-pointer"
                >
                  Copiar resumen
                </button>
                <button
                  type="button"
                  id="toggle-resumen-sample"
                  class="px-4 py-2 text-sm font-semibold rounded-lg bg-[#B84A27] text-white hover:bg-[#9A3B1E] transition-colors cursor-pointer"
                >
                  Показать образец
                </button>
              </div>
            </div>
            <div id="resumen-sample-box" class="hidden rounded-lg border border-[#E5D9C8] bg-[#FAF6F0] p-4 space-y-2 text-base">
              <p class="font-semibold text-[#B84A27]">Modelo de resumen (84 palabras):</p>
              ${trBlock(escapeHtml(EXERCISE_1_QUESTIONS.B.solEs), EXERCISE_1_QUESTIONS.B.solHy)}
            </div>
          </div>
        </div>

        <div class="space-y-4 pt-4 border-t border-[#E5D9C8]">
          <h4 class="text-xl font-semibold text-[#231914]">C. ${trInline('Análisis narrativo', 'Պատմողական վերլուծություն')}</h4>
          <div class="grid md:grid-cols-2 gap-4">
            ${EXERCISE_1_QUESTIONS.C.map((q) => renderOpenQuestionCard(q, 'ex1')).join('')}
          </div>
        </div>

        <div class="space-y-4 pt-4 border-t border-[#E5D9C8]">
          <h4 class="text-xl font-semibold text-[#231914]">D. ${trInline('Figuras literarias', 'Գրական արտահայտչամիջոցներ')}</h4>
          <p class="text-base text-[#5C4B40]">${trInline('Identifica la figura y explica su significado.', 'Գտիր արտահայտչամիջոցը և բացատրիր դրա իմաստը։')}</p>
          <div class="grid md:grid-cols-2 gap-4">
            ${EXERCISE_1_QUESTIONS.D.map((q) => renderOpenQuestionCard(q, 'ex1')).join('')}
          </div>
        </div>

        <div class="space-y-4 pt-4 border-t border-[#E5D9C8]">
          <h4 class="text-xl font-semibold text-[#231914]">E. ${trInline('Vocabulario y reflexión', 'Բառապաշար և մտածողություն')}</h4>
          <div class="grid md:grid-cols-2 gap-4">
            ${EXERCISE_1_QUESTIONS.E.map((q) => renderOpenQuestionCard(q, 'ex1')).join('')}
          </div>
        </div>
      </article>

      <!-- EJERCICIO 2 -->
      <article id="test-literatura" class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-6">
        <div class="flex flex-wrap items-end justify-between gap-4 border-b border-[#E5D9C8] pb-4">
          <div>
            <p class="text-sm font-semibold text-[#B84A27]">EJERCICIO 2</p>
            <h3 class="text-2xl sm:text-3xl font-bold text-[#231914]">${trInline('Preguntas tipo test', 'Թեստային հարցեր՝ գրականության տեսությունից')}</h3>
            <p class="text-base text-[#5C4B40] mt-1">${trInline('Elige una respuesta. Después podrás comprobar la solución y leer la explicación en español y armenio.', 'Ընտրիր մեկ պատասխան։ Հետո կարող ես ստուգել լուծումը և կարդալ բացատրությունը իսպաներեն և հայերեն։')}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-[#7A6658]">Test de literatura</p>
            <p id="test-answered-counter" class="font-mono-num text-xl font-bold text-[#231914]">0 / 15 respondidas</p>
          </div>
        </div>

        <div id="test-questions-list" class="space-y-5">
          ${TEST_QUESTIONS.map((q) => renderTestQuestion(q)).join('')}
        </div>

        <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E5D9C8]">
          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="btn-corregir-test"
              class="px-5 py-3 text-base font-semibold rounded-lg bg-[#B84A27] text-white hover:bg-[#9A3B1E] transition-colors cursor-pointer"
            >
              Corregir examen
            </button>
            <button
              type="button"
              id="btn-reiniciar-test"
              class="px-4 py-3 text-base font-medium rounded-lg border border-[#D6C7B2] bg-[#FFFDF9] text-[#231914] hover:bg-[#F3ECE1] transition-colors cursor-pointer"
            >
              Reiniciar
            </button>
          </div>
          <div id="test-summary-banner" class="hidden text-base font-semibold"></div>
        </div>
      </article>

      <!-- EJERCICIO 3 -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <p class="text-sm font-semibold text-[#B84A27]">EJERCICIO 3</p>
          <h3 class="text-2xl sm:text-3xl font-bold text-[#231914]">${trInline('Análisis de un poema y de las figuras literarias', 'Բանաստեղծության վերլուծություն և գեղարվեստական միջոցներ')}</h3>
        </div>

        <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-xl p-5 max-w-2xl space-y-1.5">
          <h4 class="font-bold text-lg text-[#231914] mb-2">${trInline('Lectura: «El bosque de los sueños»', 'Ընթերցանություն․ «Երազանքների անտառը»')}</h4>
          ${EXERCISE_3_POEM.map((line) => trBlock(escapeHtml(line.es), line.hy, 'italic')).join('')}
        </div>

        <div class="space-y-4">
          <h4 class="text-xl font-semibold text-[#231914]">${trInline('Preguntas', 'Հարցեր')}</h4>
          <div class="grid md:grid-cols-2 gap-4">
            ${EXERCISE_3_QUESTIONS.map((q) => renderOpenQuestionCard(q, 'ex3')).join('')}
          </div>
        </div>

        <div class="space-y-4 pt-4 border-t border-[#E5D9C8]">
          <div>
            <h4 class="text-xl font-semibold text-[#231914]">${trInline('Práctica de métrica', 'Վանկերի հաշվարկ')}</h4>
            <p class="text-base text-[#5C4B40]">${trInline('Cuenta las sílabas métricas e indica si hay sinalefa.', 'Հաշվիր չափական վանկերը և նշիր՝ կա արդյոք սինալեֆա։')}</p>
            <p class="text-sm text-[#7A6658] mt-1">Эти строки предназначены для отдельной тренировки подсчёта слогов. Не обязательно все из них восьмисложные.</p>
          </div>
          <div class="space-y-3" id="metrica-list">
            ${METRICA_ITEMS.map((m) => renderMetricaRow(m)).join('')}
          </div>
        </div>
      </article>

      <!-- EJERCICIO 4 -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-6">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-[#B84A27]">EJERCICIO 4</p>
            <h3 class="text-2xl sm:text-3xl font-bold text-[#231914]">${trInline('Identifica las figuras literarias', 'Գտիր արտահայտչամիջոցը և նշիր մակարդակը')}</h3>
            <p class="text-base text-[#5C4B40] mt-1">${trInline('Para cada frase, escribe el nombre de la figura literaria y explica cómo la has reconocido.', 'Յուրաքանչյուր նախադասության համար ընտրիր արտահայտչամիջոցի անունը և մակարդակը՝ ստուգելով պատասխանդ։')}</p>
          </div>
          <button
            type="button"
            id="btn-check-all-figuras"
            class="px-4 py-2.5 text-sm font-semibold rounded-lg bg-[#B84A27] text-white hover:bg-[#9A3B1E] transition-colors cursor-pointer shrink-0"
          >
            Проверить все (46–61)
          </button>
        </div>

        <div class="space-y-3" id="figuras-list">
          ${EXERCISE_4_ITEMS.map((item) => renderFiguraRow(item)).join('')}
        </div>

        <div class="space-y-4 pt-4 border-t border-[#E5D9C8]">
          <h4 class="text-lg font-semibold text-[#231914]">Preguntas adicionales:</h4>
          <div class="grid md:grid-cols-3 gap-4">
            ${EXERCISE_4_EXTRA.map((q) => renderOpenQuestionCard(q, 'ex4')).join('')}
          </div>
        </div>
      </article>

      <!-- EJERCICIO 5 -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <p class="text-sm font-semibold text-[#B84A27]">EJERCICIO 5</p>
          <h3 class="text-2xl sm:text-3xl font-bold text-[#231914]">${trInline('Análisis de un texto teatral', 'Թատերական տեքստի վերլուծություն')}</h3>
        </div>

        <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-xl p-5 space-y-3 text-base">
          <h4 class="font-bold text-lg text-[#231914] mb-2">${trInline('Lectura: «Una sorpresa para la profesora»', 'Ընթերցանություն․ «Անակնկալ ուսուցչուհու համար»')}</h4>
          ${EXERCISE_5_SCRIPT.map((row) => {
            if (row.type === 'meta') {
              return `<div class="font-medium text-[#5C4B40] pb-2 border-b border-[#E5D9C8]">${trBlock(escapeHtml(row.es), row.hy)}</div>`;
            }
            if (row.type === 'stage') {
              return `<div class="italic text-[#5C4B40]">${trBlock(escapeHtml(row.es), row.hy)}</div>`;
            }
            return `<div>${trBlock(`<strong>${escapeHtml(row.speaker)}:</strong> ${escapeHtml(row.es)}`, `${row.speaker}. ${row.hy}`)}</div>`;
          }).join('')}
        </div>

        <div class="space-y-4">
          <h4 class="text-xl font-semibold text-[#231914]">${trInline('Preguntas', 'Հարցեր')}</h4>
          <div class="grid md:grid-cols-2 gap-4">
            ${EXERCISE_5_QUESTIONS.map((q) => renderOpenQuestionCard(q, 'ex5')).join('')}
          </div>
        </div>
      </article>

      <!-- EJERCICIO 6 -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <p class="text-sm font-semibold text-[#B84A27]">EJERCICIO 6</p>
          <h3 class="text-2xl sm:text-3xl font-bold text-[#231914]">${trInline('Literatura popular, culta, cuento, mito y leyenda', 'Ժողովրդական և հեղինակային գրականություն, հեքիաթ, առասպել, ավանդազրույց')}</h3>
        </div>

        <div class="grid lg:grid-cols-3 gap-5">
          ${EXERCISE_6_TEXTS.map((t) => `
            <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-xl p-5 space-y-2.5">
              <h4 class="font-bold text-lg text-[#231914]">${trInline(t.titleEs, t.titleHy)}</h4>
              ${trBlock(escapeHtml(t.es), t.hy, 'leading-relaxed')}
            </div>
          `).join('')}
        </div>

        <!-- Q75 interactive classification -->
        <div class="border border-[#E5D9C8] rounded-xl p-5 space-y-4 bg-[#FFFDF9]">
          <div class="font-semibold text-base text-[#231914]">
            75. ${trInline('Clasifica los tres textos: cuento, mito o leyenda.', 'Դասակարգիր երեք տեքստերը՝ պատմվածք, առասպել կամ ավանդազրույց։')}
          </div>
          <div class="grid sm:grid-cols-3 gap-4">
            ${EXERCISE_6_TEXTS.map((t) => `
              <div class="space-y-1.5">
                <label class="block text-sm font-semibold text-[#5C4B40]" for="ex6-sel-${t.key}">${escapeHtml(t.titleEs)}</label>
                <select id="ex6-sel-${t.key}" data-ex6-select="${t.key}" class="w-full rounded-lg border border-[#D6C7B2] bg-[#FAF6F0] px-3 py-2.5 text-base text-[#231914] focus:border-[#B84A27] focus:outline-none">
                  <option value="">Elige género...</option>
                  <option value="Cuento" ${state.ex6ClassAnswers[t.key] === 'Cuento' ? 'selected' : ''}>Cuento</option>
                  <option value="Mito" ${state.ex6ClassAnswers[t.key] === 'Mito' ? 'selected' : ''}>Mito</option>
                  <option value="Leyenda" ${state.ex6ClassAnswers[t.key] === 'Leyenda' ? 'selected' : ''}>Leyenda</option>
                </select>
              </div>
            `).join('')}
          </div>
          <button
            type="button"
            id="btn-check-ex6-75"
            class="px-4 py-2 text-sm font-semibold rounded-lg bg-[#B84A27] text-white hover:bg-[#9A3B1E] transition-colors cursor-pointer"
          >
            Проверить классификацию (75)
          </button>
          <div id="ex6-75-feedback" class="hidden space-y-2 text-base"></div>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          ${EXERCISE_6_QUESTIONS.map((q) => renderOpenQuestionCard(q, 'ex6')).join('')}
        </div>
      </article>
    </section>
  `;
}

function renderTestQuestion(q) {
  const chosen = state.testAnswers[q.id];
  const checked = state.testChecked;
  let feedbackHtml = '';

  if (checked) {
    if (!chosen) {
      feedbackHtml = `
        <div class="feedback-neutral rounded-lg p-4 text-base space-y-1.5">
          <p class="font-semibold text-[#B45309]">— Не выбрано / Պատասխան չի ընտրվել</p>
          <p>Выбери вариант и нажми «Corregir examen» еще раз. Правильный ответ: <strong>${q.correct}</strong>.</p>
          ${trBlock(escapeHtml(q.correctExplanationEs), q.correctExplanationHy)}
        </div>
      `;
    } else if (chosen === q.correct) {
      feedbackHtml = `
        <div class="feedback-correct rounded-lg p-4 text-base space-y-1.5">
          <p class="font-bold">✓ Правильно / Ճիշտ է (Вариант ${q.correct})</p>
          ${trBlock(escapeHtml(q.correctExplanationEs), q.correctExplanationHy)}
        </div>
      `;
    } else {
      const wrongInfo = q.wrongReasons[chosen];
      feedbackHtml = `
        <div class="feedback-wrong rounded-lg p-4 text-base space-y-2.5">
          <p class="font-bold">✕ Неверно / Սխալ է — Вы выбрали ${chosen}, правильный ответ: ${q.correct}</p>
          <div class="space-y-1">
            <p class="font-semibold text-sm">Почему вариант ${chosen} неверный / Ինչո՞ւ է սխալ ${chosen} տարբերակը.</p>
            ${trBlock(escapeHtml(wrongInfo.es), wrongInfo.hy)}
            <p class="text-sm">${escapeHtml(wrongInfo.hy)}</p>
          </div>
          <div class="pt-2 border-t border-[#FECACA] space-y-1">
            <p class="font-semibold text-sm text-[#15803D]">Почему правильный ответ — ${q.correct} / Ինչո՞ւ է ճիշտ ${q.correct}-ն.</p>
            ${trBlock(escapeHtml(q.correctExplanationEs), q.correctExplanationHy)}
            <p class="text-sm text-[#14532D]">${escapeHtml(q.correctExplanationHy)}</p>
          </div>
        </div>
      `;
    }
  }

  return `
    <div class="border border-[#E5D9C8] rounded-xl p-5 space-y-3.5" data-test-q="${q.id}">
      <div class="font-semibold text-lg text-[#231914]">
        <span class="font-mono-num text-[#B84A27] mr-1">${q.id}.</span>
        ${trInline(q.es, q.hy)}
      </div>
      <div class="grid sm:grid-cols-2 gap-3">
        ${q.options.map((opt) => {
          const isSelected = chosen === opt.key;
          let stateClasses = isSelected
            ? 'border-[#B84A27] bg-[#FFF1E6] text-[#7C2D12]'
            : 'border-[#E5D9C8] bg-[#FFFDF9] text-[#231914] hover:bg-[#FAF6F0]';

          if (checked) {
            if (opt.key === q.correct) {
              stateClasses = 'border-[#15803D] bg-[#F0FDF4] text-[#14532D]';
            } else if (isSelected && opt.key !== q.correct) {
              stateClasses = 'border-[#B91C1C] bg-[#FEF2F2] text-[#7F1D1D]';
            }
          }

          return `
            <div class="flex flex-col gap-1">
              <div class="flex items-stretch gap-1.5">
                <button
                  type="button"
                  data-test-opt="${q.id}:${opt.key}"
                  class="flex-1 min-h-[48px] flex items-center justify-between gap-2 text-left rounded-lg border px-4 py-2.5 text-base transition-colors cursor-pointer ${stateClasses}"
                >
                  <span><strong class="font-mono-num mr-1.5">${opt.key}.</strong> ${escapeHtml(opt.text)}</span>
                </button>
                <button
                  type="button"
                  data-opt-tr="${q.id}:${opt.key}"
                  title="Перевести вариант на армянский"
                  class="px-2.5 rounded-lg border border-[#E5D9C8] bg-[#FAF6F0] text-xs font-semibold text-[#B84A27] hover:bg-[#FFF1E6] transition-colors cursor-pointer shrink-0"
                >
                  Հայ
                </button>
              </div>
              <div id="opt-hy-${q.id}-${opt.key}" class="${state.allTranslationsOpen ? '' : 'hidden'} px-3 py-1.5 rounded-md bg-[#F3ECE1] border border-[#E5D9C8] text-sm text-[#231914]">
                <span class="font-semibold text-[#9A3B1E]">Հայերեն:</span> ${escapeHtml(opt.hy)}
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="test-feedback-slot">${feedbackHtml}</div>
    </div>
  `;
}

function renderMetricaRow(m) {
  return `
    <div class="border border-[#E5D9C8] rounded-xl p-4 sm:p-5 space-y-3 bg-[#FAF6F0]" data-metrica-id="${m.id}">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-start gap-2.5 flex-1 min-w-[260px]">
          <span class="font-mono-num font-semibold text-base text-[#B84A27] pt-0.5">${m.id}.</span>
          <div class="flex-1">${trBlock(escapeHtml(m.verse), m.hy, 'font-medium text-[#231914]')}</div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <label class="text-sm text-[#5C4B40] flex items-center gap-1.5">
            <span>Sílabas:</span>
            <input
              type="number"
              min="1"
              max="20"
              data-metrica-syll="${m.id}"
              placeholder="?"
              class="w-16 rounded-lg border border-[#D6C7B2] bg-[#FFFDF9] px-2.5 py-1.5 text-base font-mono-num text-[#231914] focus:border-[#B84A27] focus:outline-none"
            />
          </label>
          <label class="text-sm text-[#5C4B40] flex items-center gap-1.5">
            <span>Sinalefa:</span>
            <select
              data-metrica-sin="${m.id}"
              class="rounded-lg border border-[#D6C7B2] bg-[#FFFDF9] px-2.5 py-1.5 text-base text-[#231914] focus:border-[#B84A27] focus:outline-none"
            >
              <option value="">—</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>
          <button
            type="button"
            data-check-metrica="${m.id}"
            class="px-4 py-2 text-sm font-semibold rounded-lg bg-[#B84A27] text-white hover:bg-[#9A3B1E] transition-colors cursor-pointer"
          >
            Проверить
          </button>
        </div>
      </div>
      <div id="metrica-fb-${m.id}" class="hidden rounded-lg p-3.5 text-base"></div>
    </div>
  `;
}

function renderFiguraRow(item) {
  return `
    <div class="border border-[#E5D9C8] rounded-xl p-4 sm:p-5 space-y-3 bg-[#FAF6F0]" data-figura-id="${item.id}">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="flex items-start gap-2.5 flex-1 min-w-[260px]">
          <span class="font-mono-num font-semibold text-base text-[#B84A27] pt-0.5">${item.id}.</span>
          <div class="flex-1">${trBlock(escapeHtml(item.phrase), item.hy, 'font-medium text-[#231914]')}</div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <select
            data-figura-sel="${item.id}"
            aria-label="Figura literaria ${item.id}"
            class="rounded-lg border border-[#D6C7B2] bg-[#FFFDF9] px-3 py-2 text-sm sm:text-base text-[#231914] focus:border-[#B84A27] focus:outline-none"
          >
            <option value="">Figura literaria...</option>
            ${FIGURE_NAMES.map((fn) => `<option value="${escapeHtml(fn)}">${escapeHtml(fn)}</option>`).join('')}
          </select>
          <select
            data-level-sel="${item.id}"
            aria-label="Nivel ${item.id}"
            class="rounded-lg border border-[#D6C7B2] bg-[#FFFDF9] px-3 py-2 text-sm sm:text-base text-[#231914] focus:border-[#B84A27] focus:outline-none"
          >
            <option value="">Nivel...</option>
            ${LEVEL_NAMES.map((lv) => `<option value="${escapeHtml(lv)}">${escapeHtml(lv)}</option>`).join('')}
          </select>
          <button
            type="button"
            data-check-figura="${item.id}"
            class="px-3.5 py-2 text-sm font-semibold rounded-lg bg-[#FFFDF9] border border-[#D6C7B2] text-[#231914] hover:bg-[#F3ECE1] transition-colors cursor-pointer"
          >
            Проверить
          </button>
        </div>
      </div>
      <div id="figura-fb-${item.id}" class="hidden rounded-lg p-3.5 text-base"></div>
    </div>
  `;
}

function renderParteIV() {
  return `
    <section id="parte-4" class="section-block space-y-8" data-section="parte-4">
      <div class="border-b border-[#E5D9C8] pb-4">
        <p class="text-sm font-semibold tracking-wide text-[#B84A27] mb-1">PARTE IV</p>
        <h2 class="text-3xl sm:text-4xl font-bold text-[#231914]">PARTE IV. SOLUCIONARIO</h2>
        <p class="text-base text-[#5C4B40] mt-1">В этом разделе даны образцы полных ответов. Нажми на любой испанский ответ, чтобы открыть перевод на армянский.</p>
      </div>

      <!-- Soluciones Ejercicio 1 -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-5">
        <h3 class="text-2xl font-bold text-[#231914]">${trInline('Soluciones del ejercicio 1', 'Տեքստի վերլուծության պատասխաններ')}</h3>

        <div class="space-y-2.5">
          <h4 class="font-semibold text-[#B84A27]">A. Comprensión lectora</h4>
          <ol class="space-y-2.5">
            ${EXERCISE_1_QUESTIONS.A.map((q) => `
              <li class="border-b border-[#F3ECE1] pb-2.5">
                ${trBlock(`<strong class="font-mono-num">${q.id}.</strong> ${escapeHtml(q.solEs)}`, q.solHy)}
              </li>
            `).join('')}
          </ol>
        </div>

        <div class="space-y-2.5 pt-2">
          <h4 class="font-semibold text-[#B84A27]">B. Modelo de resumen</h4>
          <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-lg p-4 space-y-2">
            <p class="text-sm font-semibold text-[#5C4B40]">Ejemplo de respuesta (84 palabras):</p>
            ${trBlock(escapeHtml(EXERCISE_1_QUESTIONS.B.solEs), EXERCISE_1_QUESTIONS.B.solHy)}
          </div>
        </div>

        <div class="space-y-2.5 pt-2">
          <h4 class="font-semibold text-[#B84A27]">C. Análisis narrativo</h4>
          <ol class="space-y-2.5">
            ${EXERCISE_1_QUESTIONS.C.map((q) => `
              <li class="border-b border-[#F3ECE1] pb-2.5">
                ${trBlock(`<strong class="font-mono-num">${q.id}.</strong> ${escapeHtml(q.solEs)}`, q.solHy)}
              </li>
            `).join('')}
          </ol>
        </div>

        <div class="space-y-2.5 pt-2">
          <h4 class="font-semibold text-[#B84A27]">D. Figuras literarias</h4>
          <ol class="space-y-2.5">
            ${EXERCISE_1_QUESTIONS.D.map((q) => `
              <li class="border-b border-[#F3ECE1] pb-2.5">
                ${trBlock(`<strong class="font-mono-num">${q.id}.</strong> ${escapeHtml(q.solEs)}`, q.solHy)}
              </li>
            `).join('')}
          </ol>
        </div>

        <div class="space-y-2.5 pt-2">
          <h4 class="font-semibold text-[#B84A27]">E. Vocabulario y reflexión</h4>
          <ol class="space-y-2.5">
            ${EXERCISE_1_QUESTIONS.E.map((q) => `
              <li class="border-b border-[#F3ECE1] pb-2.5">
                ${trBlock(`<strong class="font-mono-num">${q.id}.</strong> ${escapeHtml(q.solEs)}`, q.solHy)}
              </li>
            `).join('')}
          </ol>
        </div>
      </article>

      <!-- Soluciones Ejercicio 2 (Test key) -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-4">
        <h3 class="text-2xl font-bold text-[#231914]">${trInline('Soluciones del ejercicio 2', 'Թեստի պատասխաններ և բացատրություններ')}</h3>
        <div class="grid md:grid-cols-2 gap-3.5">
          ${TEST_QUESTIONS.map((q) => `
            <div class="border border-[#E5D9C8] rounded-lg p-4 space-y-1.5">
              <p class="font-semibold text-[#231914]"><span class="font-mono-num text-[#B84A27]">${q.id}.</span> ${escapeHtml(q.correct)} — ${escapeHtml(q.options.find((o) => o.key === q.correct).text)}</p>
              ${trBlock(escapeHtml(q.correctExplanationEs), q.correctExplanationHy)}
            </div>
          `).join('')}
        </div>
      </article>

      <!-- Soluciones Ejercicio 3 -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-5">
        <h3 class="text-2xl font-bold text-[#231914]">${trInline('Soluciones del ejercicio 3', 'Բանաստեղծության պատասխաններ')}</h3>
        <ol class="space-y-2.5">
          ${EXERCISE_3_QUESTIONS.map((q) => `
            <li class="border-b border-[#F3ECE1] pb-2.5">
              ${trBlock(`<strong class="font-mono-num">${q.id}.</strong> ${escapeHtml(q.solEs)}`, q.solHy)}
            </li>
          `).join('')}
        </ol>

        <h4 class="text-lg font-semibold text-[#B84A27] pt-2">Soluciones de métrica</h4>
        <div class="overflow-x-auto border border-[#E5D9C8] rounded-lg">
          <table class="study-table">
            <thead><tr><th>N.º</th><th>Verso</th><th>Resultado</th></tr></thead>
            <tbody>
              ${METRICA_ITEMS.map((m) => `
                <tr>
                  <td class="font-mono-num">${m.id}</td>
                  <td>${trBlock(escapeHtml(m.verse), m.hy)}</td>
                  <td>${trBlock(escapeHtml(m.breakdown), m.hyExplanation)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-lg p-4 space-y-1.5">
          ${trBlock('<strong>Pregunta adicional para el examen:</strong> ¿Son todos estos versos octosílabos?', 'Արդյո՞ք այս բոլոր տողերը ութվանկանի են։')}
          ${trBlock('<strong>Respuesta:</strong> No. El verso 43 tiene nueve sílabas métricas.', 'Ո՛չ։ 43-րդ տողն ունի ինը չափական վանկ։')}
        </div>
      </article>

      <!-- Soluciones Ejercicio 4 -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-5">
        <h3 class="text-2xl font-bold text-[#231914]">${trInline('Soluciones del ejercicio 4', 'Գրական արտահայտչամիջոցների պատասխաններ')}</h3>
        <div class="overflow-x-auto border border-[#E5D9C8] rounded-lg">
          <table class="study-table">
            <thead><tr><th>N.º</th><th>Figura literaria</th><th>Nivel</th></tr></thead>
            <tbody>
              ${EXERCISE_4_ITEMS.map((item) => `
                <tr>
                  <td class="font-mono-num">${item.id}</td>
                  <td>${trBlock(`<strong>${escapeHtml(item.figure)}</strong>`, item.explainHy)}</td>
                  <td>${escapeHtml(item.level)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="space-y-2.5">
          ${EXERCISE_4_EXTRA.map((q) => `
            <div class="border-b border-[#F3ECE1] pb-2.5">
              ${trBlock(`<strong class="font-mono-num">${q.id}.</strong> ${escapeHtml(q.solEs)}`, q.solHy)}
            </div>
          `).join('')}
          <p class="text-sm text-[#7A6658] pt-2 italic">Nota: Las clasificaciones por niveles pueden variar ligeramente según el manual escolar. En tus apuntes se sitúa la epanadiplosis dentro del nivel fónico; otros libros la estudian como recurso de repetición morfosintáctica. Para el examen conviene seguir el esquema que utiliza el profesor.</p>
        </div>
      </article>

      <!-- Soluciones Ejercicio 5 -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-4">
        <h3 class="text-2xl font-bold text-[#231914]">${trInline('Soluciones del ejercicio 5', 'Թատերական տեքստի պատասխաններ')}</h3>
        <ol class="space-y-2.5">
          ${EXERCISE_5_QUESTIONS.map((q) => `
            <li class="border-b border-[#F3ECE1] pb-2.5">
              ${trBlock(`<strong class="font-mono-num">${q.id}.</strong> ${escapeHtml(q.solEs)}`, q.solHy)}
            </li>
          `).join('')}
        </ol>
      </article>

      <!-- Soluciones Ejercicio 6 -->
      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-4">
        <h3 class="text-2xl font-bold text-[#231914]">${trInline('Soluciones del ejercicio 6', 'Երեք պատմությունների պատասխաններ')}</h3>
        <div class="border-b border-[#F3ECE1] pb-2.5">
          ${trBlock('<strong class="font-mono-num">75.</strong> Texto A: leyenda. Texto B: mito. Texto C: cuento.', 'Տեքստ A՝ ավանդազրույց։ Տեքստ B՝ առասպել։ Տեքստ C՝ պատմվածք։')}
        </div>
        <ol class="space-y-2.5">
          ${EXERCISE_6_QUESTIONS.map((q) => `
            <li class="border-b border-[#F3ECE1] pb-2.5">
              ${trBlock(`<strong class="font-mono-num">${q.id}.</strong> ${escapeHtml(q.solEs)}`, q.solHy)}
            </li>
          `).join('')}
        </ol>
      </article>
    </section>
  `;
}

function renderParteV() {
  const checkedCount = state.checklist.filter(Boolean).length;
  return `
    <section id="parte-5" class="section-block space-y-8" data-section="parte-5">
      <div class="border-b border-[#E5D9C8] pb-4">
        <p class="text-sm font-semibold tracking-wide text-[#B84A27] mb-1">PARTE V</p>
        <h2 class="text-3xl sm:text-4xl font-bold text-[#231914]">PARTE V. REPASO FINAL</h2>
      </div>

      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-5">
        <div>
          <h3 class="text-2xl font-bold text-[#231914]">20 preguntas orales que debe saber responder</h3>
          <p class="text-base text-[#5C4B40]">Эти вопросы можно задавать ученику устно во время урока, не показывая заранее ответы. Нажми на испанский вопрос для перевода на армянский.</p>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          ${ORAL_QUESTIONS.map((oq) => `
            <div class="border border-[#E5D9C8] rounded-xl p-4 space-y-2.5">
              <div class="flex items-start gap-2.5">
                <span class="font-mono-num font-semibold text-[#B84A27] shrink-0">${oq.n}.</span>
                <div class="flex-1">
                  ${trBlock(escapeHtml(oq.es), oq.hy, 'font-medium text-[#231914]')}
                </div>
              </div>
              <div>
                <button
                  type="button"
                  data-toggle-oral="${oq.n}"
                  class="text-sm font-semibold text-[#B84A27] hover:underline cursor-pointer"
                >
                  Показать ответ
                </button>
                <div id="oral-ans-${oq.n}" class="hidden mt-2 rounded-lg bg-[#FAF6F0] border border-[#E5D9C8] p-3 text-base space-y-1">
                  ${trBlock(escapeHtml(oq.ansEs), oq.ansHy)}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </article>

      <article class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5D9C8] pb-4">
          <div>
            <h3 class="text-2xl font-bold text-[#231914]">${trInline('Lista de control antes del examen', 'Ստուգաթերթ քննությունից առաջ')}</h3>
            <p class="text-base text-[#5C4B40]">Mi preparación</p>
          </div>
          <div class="flex items-center gap-4">
            <span id="checklist-counter" class="font-mono-num text-xl font-bold text-[#B84A27]">${checkedCount}/${CHECKLIST_ITEMS.length}</span>
            <button
              type="button"
              id="btn-reset-checklist"
              class="px-4 py-2 text-sm font-medium rounded-lg border border-[#D6C7B2] bg-[#FFFDF9] text-[#231914] hover:bg-[#F3ECE1] transition-colors cursor-pointer"
            >
              Reiniciar lista
            </button>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-3.5" id="checklist-items">
          ${CHECKLIST_ITEMS.map((item, idx) => `
            <div class="flex items-start gap-3 border border-[#E5D9C8] rounded-xl p-4 hover:bg-[#FAF6F0] transition-colors">
              <input
                type="checkbox"
                data-check-idx="${idx}"
                aria-label="${escapeHtml(item.es)}"
                ${state.checklist[idx] ? 'checked' : ''}
                class="mt-1.5 h-5 w-5 rounded border-[#D6C7B2] accent-[#B84A27] cursor-pointer shrink-0"
              />
              <div class="flex-1">
                ${trBlock(escapeHtml(item.es), item.hy, 'font-medium text-[#231914]')}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="bg-[#FAF6F0] border border-[#E5D9C8] rounded-xl p-5 space-y-3 text-base">
          <p class="text-[#231914]">Для подготовки я бы распределила этот материал на четыре полноценных занятия: сначала литературные роды и жанры, затем все figuras literarias, после этого romance и métrica, а на последнем занятии — полноценный анализ текста с resumen без подсказок.</p>
          <p class="text-[#231914]">Самое важное для экзамена: ученик должен уметь написать не просто «Es una personificación», а полное объяснение (<em>respuesta justificada</em>):</p>
          ${trBlock(
            '«Es una personificación porque se atribuye una acción humana, bailar, a las flores».',
            'Սա անձնավորում է, որովհետև ծաղիկներին վերագրվում է մարդկային գործողություն՝ պարելը։',
            'font-semibold text-[#9A3B1E]'
          )}
          <p class="text-sm text-[#7A6658]">Именно такой переход от короткого ответа к ответу с обоснованием (<em>respuesta justificada</em>) стоит тренировать особенно тщательно.</p>
        </div>
      </article>
    </section>
  `;
}

function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  root.innerHTML = `
    <header class="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur border-b border-[#E5D9C8]">
      <div class="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        <a href="#top" class="font-display text-lg sm:text-xl font-bold tracking-tight text-[#231914] whitespace-nowrap shrink-0">
          Lengua y Literatura · ESO
        </a>
        <nav class="hidden md:flex items-center gap-6 text-base font-medium text-[#5C4B40]">
          <a href="#parte-1" class="hover:text-[#B84A27] transition-colors whitespace-nowrap shrink-0">I. Teoría</a>
          <a href="#parte-2" class="hover:text-[#B84A27] transition-colors whitespace-nowrap shrink-0">II. Análisis</a>
          <a href="#parte-3" class="hover:text-[#B84A27] transition-colors whitespace-nowrap shrink-0">III. Examen</a>
          <a href="#parte-4" class="hover:text-[#B84A27] transition-colors whitespace-nowrap shrink-0">IV. Solucionario</a>
          <a href="#parte-5" class="hover:text-[#B84A27] transition-colors whitespace-nowrap shrink-0">V. Repaso</a>
        </nav>
        <div class="shrink-0">
          <a href="#test-literatura" class="inline-block px-4 py-2 text-sm font-semibold rounded-lg bg-[#B84A27] text-white hover:bg-[#9A3B1E] transition-colors whitespace-nowrap shrink-0">
            Ir al Test
          </a>
        </div>
      </div>
    </header>

    <main id="top" class="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
      <!-- Hero & Workspace Controls -->
      <section class="bg-[#FFFDF9] border border-[#E5D9C8] rounded-xl p-6 sm:p-8 space-y-5">
        <div class="space-y-3 max-w-4xl">
          <p class="text-sm font-semibold text-[#B84A27]">Քննության ամբողջական պատրաստություն՝ 7-րդ դասարան · Իսպաներեն + Հայերեն</p>
          <h1 class="text-3xl sm:text-5xl font-bold text-[#231914] leading-tight">
            Preparación completa para el examen de Lengua Castellana y Literatura — 1.º–2.º ESO
          </h1>
          <p class="text-lg text-[#5C4B40]">
            Это не просто определения: мы разберём, как распознавать литературные приёмы, анализировать тексты, объяснять свои ответы и писать resumen, как это требуется на школьных экзаменах в Испании. Материал рассчитан на уровень 1.º–2.º ESO.
          </p>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E5D9C8]">
          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="btn-toggle-all-tr"
              class="px-4 py-2 text-sm font-semibold rounded-lg border border-[#F3C4A7] bg-[#FFF1E6] text-[#9A3B1E] hover:bg-[#FDE6D4] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              ${state.allTranslationsOpen ? 'Скрыть все переводы' : 'Открыть все переводы'}
            </button>
            <span class="text-sm text-[#5C4B40]">Нажми на любой испанский текст, чтобы открыть перевод на армянский</span>
          </div>

          <div class="flex items-center gap-1 p-1 bg-[#F3ECE1] rounded-lg overflow-x-auto" role="tablist" aria-label="Разделы курса">
            ${[
              { id: 'all', label: 'Todo' },
              { id: 'parte-1', label: 'I. Teoría' },
              { id: 'parte-2', label: 'II. Análisis' },
              { id: 'parte-3', label: 'III. Examen' },
              { id: 'parte-4', label: 'IV. Solucionario' },
              { id: 'parte-5', label: 'V. Repaso' }
            ].map((tab) => `
              <button
                type="button"
                data-filter-section="${tab.id}"
                class="px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${state.activeSectionFilter === tab.id ? 'bg-[#FFFDF9] text-[#231914] shadow-sm' : 'text-[#5C4B40] hover:text-[#231914]'}"
              >
                ${tab.label}
              </button>
            `).join('')}
          </div>
        </div>
      </section>

      <div id="sections-container" class="space-y-12">
        ${renderParteI()}
        ${renderParteII()}
        ${renderParteIII()}
        ${renderParteIV()}
        ${renderParteV()}
      </div>
    </main>

    <footer class="border-t border-[#E5D9C8] bg-[#FFFDF9] mt-14">
      <div class="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-sm text-[#7A6658]">
        <span>Lengua Castellana y Literatura · 1.º–2.º ESO</span>
        <a href="#top" class="font-medium text-[#B84A27] hover:underline">Наверх</a>
      </div>
    </footer>
  `;

  bindEvents();
  applySectionFilter();
  updateTestCounter();
}

function applySectionFilter() {
  const blocks = document.querySelectorAll('.section-block');
  blocks.forEach((el) => {
    const sec = el.getAttribute('data-section');
    if (state.activeSectionFilter === 'all' || state.activeSectionFilter === sec) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });
}

function updateTestCounter() {
  const answered = Object.keys(state.testAnswers).length;
  const counterEl = document.getElementById('test-answered-counter');
  if (counterEl) {
    counterEl.textContent = `${answered} / ${TEST_QUESTIONS.length} respondidas`;
  }
}

function refreshTestUI() {
  const listEl = document.getElementById('test-questions-list');
  if (listEl) {
    listEl.innerHTML = TEST_QUESTIONS.map((q) => renderTestQuestion(q)).join('');
  }
  updateTestCounter();

  const summaryEl = document.getElementById('test-summary-banner');
  if (summaryEl) {
    if (state.testChecked) {
      let score = 0;
      TEST_QUESTIONS.forEach((q) => {
        if (state.testAnswers[q.id] === q.correct) score++;
      });
      const pct = Math.round((score / TEST_QUESTIONS.length) * 100);
      summaryEl.classList.remove('hidden');
      summaryEl.className = `text-base font-semibold px-4 py-2 rounded-lg border font-mono-num ${
        score >= 11 ? 'feedback-correct' : 'feedback-wrong'
      }`;
      summaryEl.textContent = `Resultado: ${score} / ${TEST_QUESTIONS.length} (${pct}%) — ${
        score >= 11 ? '✓ Muy bien / Շատ լավ է' : 'Revisa las explicaciones / Ստուգիր սխալների բացատրությունները'
      }`;
    } else {
      summaryEl.classList.add('hidden');
      summaryEl.textContent = '';
    }
  }
}

function checkMetricaItem(id) {
  const item = METRICA_ITEMS.find((m) => m.id === id);
  if (!item) return;

  const syllInput = document.querySelector(`[data-metrica-syll="${id}"]`);
  const sinSelect = document.querySelector(`[data-metrica-sin="${id}"]`);
  const fbEl = document.getElementById(`metrica-fb-${id}`);
  if (!syllInput || !sinSelect || !fbEl) return;

  const userSyll = parseInt(syllInput.value, 10);
  const userSin = sinSelect.value;

  fbEl.classList.remove('hidden');

  if (Number.isNaN(userSyll) || !userSin) {
    fbEl.className = 'rounded-lg p-3.5 text-base feedback-neutral';
    fbEl.innerHTML = `Пожалуйста, укажи количество слогов и выбери, есть ли синалефа.`;
    return;
  }

  const syllOk = userSyll === item.syllables;
  const sinOk = (userSin === 'si') === item.hasSinalefa;

  if (syllOk && sinOk) {
    fbEl.className = 'rounded-lg p-3.5 text-base feedback-correct space-y-1.5';
    fbEl.innerHTML = `
      <p class="font-bold">✓ Правильно (${item.syllables} sílabas, sinalefa: ${item.hasSinalefa ? 'Sí' : 'No'})</p>
      ${trBlock(escapeHtml(item.breakdown), item.hyExplanation)}
    `;
  } else {
    const reasons = [];
    if (!syllOk) {
      reasons.push(`Количество слогов указано неверно (${userSyll} вместо ${item.syllables}). Վանկերի քանակը սխալ է (${userSyll}՝ ${item.syllables}-ի փոխարեն)։`);
    }
    if (!sinOk) {
      reasons.push(
        item.hasSinalefa
          ? 'Ты не отметил(а) синалефу: здесь конечная гласная одного слова сливается с начальной гласной следующего. Դու չես նշել սինալեֆան, մինչդեռ կա ձայնավորների միացում։'
          : 'Здесь нет синалефы (ни одно слово не заканчивается гласной перед словом на гласную). Այստեղ սինալեֆա չկա։'
      );
    }
    fbEl.className = 'rounded-lg p-3.5 text-base feedback-wrong space-y-2';
    fbEl.innerHTML = `
      <p class="font-bold">✕ Неверно / Սխալ է</p>
      <p class="text-sm font-medium">${reasons.map(escapeHtml).join(' ')}</p>
      ${trBlock(escapeHtml(item.breakdown), item.hyExplanation)}
    `;
  }
}

function checkFiguraItem(id) {
  const item = EXERCISE_4_ITEMS.find((f) => f.id === id);
  if (!item) return;

  const figSel = document.querySelector(`[data-figura-sel="${id}"]`);
  const lvlSel = document.querySelector(`[data-level-sel="${id}"]`);
  const fbEl = document.getElementById(`figura-fb-${id}`);
  if (!figSel || !lvlSel || !fbEl) return;

  const userFig = figSel.value;
  const userLvl = lvlSel.value;
  fbEl.classList.remove('hidden');

  if (!userFig || !userLvl) {
    fbEl.className = 'rounded-lg p-3.5 text-base feedback-neutral';
    fbEl.innerHTML = 'Выбери и фигуру (Figura), и уровень (Nivel), чтобы проверить.';
    return;
  }

  const figOk = userFig === item.figure;
  const lvlOk = userLvl === item.level;

  if (figOk && lvlOk) {
    fbEl.className = 'rounded-lg p-3.5 text-base feedback-correct space-y-1.5';
    fbEl.innerHTML = `
      <p class="font-bold">✓ Правильно — ${escapeHtml(item.figure)} (${escapeHtml(item.level)})</p>
      ${trBlock(escapeHtml(item.explainEs), item.explainHy)}
    `;
  } else {
    const whyParts = [];
    if (!figOk) {
      whyParts.push(`Почему не «${userFig}» / Ինչո՞ւ «${userFig}»-ը սխալ է․ в этой фразе приём определяется не этим признаком, а тем, что ${item.explainEs}`);
    }
    if (!lvlOk) {
      whyParts.push(`Уровень «${userLvl}» неверен: правильный уровень — ${item.level} (${
        item.level === 'Fónico'
          ? 'связан со звучанием слов / կապված է հնչողության հետ'
          : item.level === 'Morfosintáctico'
          ? 'связан с порядком и повтором слов/союзов / կապված է բառերի դասավորության ու կառուցվածքի հետ'
          : 'связан со смыслом и образом / կապված է իմաստի ու պատկերի հետ'
      }).`);
    }
    fbEl.className = 'rounded-lg p-3.5 text-base feedback-wrong space-y-2';
    fbEl.innerHTML = `
      <p class="font-bold">✕ Неверно / Սխալ է — Правильно: ${escapeHtml(item.figure)} (${escapeHtml(item.level)})</p>
      <p class="text-sm">${whyParts.map(escapeHtml).join(' ')}</p>
      <p class="text-sm">${escapeHtml(item.explainHy)}</p>
    `;
  }
}

function bindEvents() {
  const app = document.getElementById('app');
  if (!app) return;

  app.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    // 1. Click-to-translate block
    const trBtn = target.closest('[data-tr-toggle]');
    if (trBtn) {
      const isOpen = trBtn.classList.toggle('is-open');
      trBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      const drawer = trBtn.nextElementSibling;
      if (drawer && drawer.classList.contains('hy-drawer')) {
        drawer.classList.toggle('is-open', isOpen);
      }
      return;
    }

    // 2. Click-to-translate inline
    const inlineBtn = target.closest('[data-tr-inline-toggle]');
    if (inlineBtn) {
      const isOpen = inlineBtn.classList.toggle('is-open');
      inlineBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      const drawer = inlineBtn.nextElementSibling;
      if (drawer && drawer.classList.contains('hy-inline-drawer')) {
        drawer.classList.toggle('is-open', isOpen);
      }
      return;
    }

    // 3. Test option translation toggle
    const optTrBtn = target.closest('[data-opt-tr]');
    if (optTrBtn) {
      const val = optTrBtn.getAttribute('data-opt-tr') || '';
      const [qId, optKey] = val.split(':');
      const box = document.getElementById(`opt-hy-${qId}-${optKey}`);
      if (box) box.classList.toggle('hidden');
      return;
    }

    // 4. Global toggle all translations
    if (target.closest('#btn-toggle-all-tr')) {
      state.allTranslationsOpen = !state.allTranslationsOpen;
      document.querySelectorAll('[data-tr-toggle]').forEach((btn) => {
        btn.classList.toggle('is-open', state.allTranslationsOpen);
        btn.setAttribute('aria-expanded', state.allTranslationsOpen ? 'true' : 'false');
      });
      document.querySelectorAll('.hy-drawer').forEach((dr) => {
        dr.classList.toggle('is-open', state.allTranslationsOpen);
      });
      document.querySelectorAll('[data-tr-inline-toggle]').forEach((btn) => {
        btn.classList.toggle('is-open', state.allTranslationsOpen);
        btn.setAttribute('aria-expanded', state.allTranslationsOpen ? 'true' : 'false');
      });
      document.querySelectorAll('.hy-inline-drawer').forEach((dr) => {
        dr.classList.toggle('is-open', state.allTranslationsOpen);
      });
      document.querySelectorAll('[id^="opt-hy-"]').forEach((box) => {
        box.classList.toggle('hidden', !state.allTranslationsOpen);
      });
      const toggleBtn = document.getElementById('btn-toggle-all-tr');
      if (toggleBtn) {
        toggleBtn.textContent = state.allTranslationsOpen
          ? 'Скрыть все переводы'
          : 'Открыть все переводы';
      }
      return;
    }

    // 5. Section filter tabs
    const filterBtn = target.closest('[data-filter-section]');
    if (filterBtn) {
      state.activeSectionFilter = filterBtn.getAttribute('data-filter-section') || 'all';
      document.querySelectorAll('[data-filter-section]').forEach((b) => {
        const active = b.getAttribute('data-filter-section') === state.activeSectionFilter;
        b.className = `px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
          active ? 'bg-[#FFFDF9] text-[#231914] shadow-sm' : 'text-[#5C4B40] hover:text-[#231914]'
        }`;
      });
      applySectionFilter();
      return;
    }

    // 6. Open question sample toggle
    const sampleBtn = target.closest('[data-toggle-sample]');
    if (sampleBtn) {
      const key = sampleBtn.getAttribute('data-toggle-sample');
      const box = document.getElementById(`sample-${key}`);
      if (box) {
        const hidden = box.classList.toggle('hidden');
        document.querySelectorAll(`[data-eval-btn="${key}"]`).forEach((eb) => {
          eb.classList.toggle('hidden', hidden);
        });
      }
      return;
    }

    // 7. Self-eval buttons on open questions
    const evalBtn = target.closest('[data-mark-open]');
    if (evalBtn) {
      const val = evalBtn.getAttribute('data-mark-open') || '';
      const [key, status] = val.split(':');
      const msgEl = document.getElementById(`eval-msg-${key}`);
      if (msgEl) {
        msgEl.classList.remove('hidden');
        if (status === 'ok') {
          msgEl.className = 'pt-2 border-t border-[#E5D9C8] text-sm font-semibold text-[#15803D]';
          msgEl.textContent = '✓ Отлично! Ответ соответствует образцу и содержит обоснование.';
        } else {
          const allOpen = [
            ...EXERCISE_1_QUESTIONS.A,
            ...EXERCISE_1_QUESTIONS.C,
            ...EXERCISE_1_QUESTIONS.D,
            ...EXERCISE_1_QUESTIONS.E
          ];
          const numId = parseInt(key.split('-')[1], 10);
          const found = allOpen.find((q) => q.id === numId);
          msgEl.className = 'pt-2 border-t border-[#E5D9C8] text-sm text-[#7F1D1D] space-y-1';
          msgEl.innerHTML = `<p class="font-semibold">✕ Почему нужно доработать / Ինչի՞ վրա ուշադրություն դարձնել.</p><p>${escapeHtml(
            found?.mistakeTip || 'Проверь, что ответ написан полным предложением (oración completa) и подкреплён доказательством из текста (justificación).'
          )}</p>`;
        }
      }
      return;
    }

    // 8. Resumen copy & sample
    if (target.closest('#copy-resumen-btn')) {
      const textarea = document.getElementById('resumen-input');
      const btn = document.getElementById('copy-resumen-btn');
      if (textarea && btn) {
        const text = textarea.value.trim();
        if (text && navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            btn.textContent = '✓ Copiado';
            setTimeout(() => {
              btn.textContent = 'Copiar resumen';
            }, 1800);
          }).catch(() => {});
        } else {
          btn.textContent = text ? 'Texto listo' : 'Escribe el resumen primero';
          setTimeout(() => {
            btn.textContent = 'Copiar resumen';
          }, 1800);
        }
      }
      return;
    }

    if (target.closest('#toggle-resumen-sample')) {
      const box = document.getElementById('resumen-sample-box');
      if (box) box.classList.toggle('hidden');
      return;
    }

    // 9. Test question option selection
    const optBtn = target.closest('[data-test-opt]');
    if (optBtn) {
      const val = optBtn.getAttribute('data-test-opt') || '';
      const [qIdStr, key] = val.split(':');
      const qId = parseInt(qIdStr, 10);
      state.testAnswers[qId] = key;
      refreshTestUI();
      return;
    }

    // 10. Corregir / Reiniciar test
    if (target.closest('#btn-corregir-test')) {
      state.testChecked = true;
      refreshTestUI();
      return;
    }

    if (target.closest('#btn-reiniciar-test')) {
      state.testAnswers = {};
      state.testChecked = false;
      refreshTestUI();
      return;
    }

    // 11. Métrica individual check
    const metBtn = target.closest('[data-check-metrica]');
    if (metBtn) {
      const id = parseInt(metBtn.getAttribute('data-check-metrica') || '0', 10);
      checkMetricaItem(id);
      return;
    }

    // 12. Figuras individual & batch check
    const figBtn = target.closest('[data-check-figura]');
    if (figBtn) {
      const id = parseInt(figBtn.getAttribute('data-check-figura') || '0', 10);
      checkFiguraItem(id);
      return;
    }

    if (target.closest('#btn-check-all-figuras')) {
      EXERCISE_4_ITEMS.forEach((item) => checkFiguraItem(item.id));
      return;
    }

    // 13. Exercise 6 Question 75 classification check
    if (target.closest('#btn-check-ex6-75')) {
      const fb = document.getElementById('ex6-75-feedback');
      if (!fb) return;
      fb.classList.remove('hidden');
      const rows = EXERCISE_6_TEXTS.map((t) => {
        const chosen = state.ex6ClassAnswers[t.key];
        if (!chosen) {
          return `<div class="feedback-neutral rounded-lg p-3 text-sm"><strong>${escapeHtml(t.titleEs)}:</strong> Не выбрано / Տեսակը ընտրված չէ։</div>`;
        }
        if (chosen === t.correctType) {
          return `<div class="feedback-correct rounded-lg p-3 text-sm"><strong>✓ ${escapeHtml(t.titleEs)}:</strong> Правильно — ${escapeHtml(t.correctType)} / Ճիշտ է։</div>`;
        }
        return `<div class="feedback-wrong rounded-lg p-3 text-sm space-y-1">
          <p><strong>✕ ${escapeHtml(t.titleEs)}:</strong> Вы выбрали «${escapeHtml(chosen)}», но правильный ответ — <strong>${escapeHtml(t.correctType)}</strong>.</p>
          <p>${escapeHtml(t.wrongTypeReasons[chosen] || '')}</p>
        </div>`;
      });
      fb.innerHTML = rows.join('');
      return;
    }

    // 14. Oral questions answer toggle
    const oralBtn = target.closest('[data-toggle-oral]');
    if (oralBtn) {
      const n = oralBtn.getAttribute('data-toggle-oral');
      const ansEl = document.getElementById(`oral-ans-${n}`);
      if (ansEl) {
        const isHidden = ansEl.classList.toggle('hidden');
        oralBtn.textContent = isHidden ? 'Показать ответ' : 'Скрыть ответ';
      }
      return;
    }

    // 15. Reset checklist
    if (target.closest('#btn-reset-checklist')) {
      state.checklist = new Array(CHECKLIST_ITEMS.length).fill(false);
      saveChecklist();
      document.querySelectorAll('[data-check-idx]').forEach((cb) => {
        if (cb instanceof HTMLInputElement) cb.checked = false;
      });
      const counter = document.getElementById('checklist-counter');
      if (counter) counter.textContent = `0/${CHECKLIST_ITEMS.length}`;
      return;
    }
  });

  // Live word counter for Resumen
  const resumenInput = document.getElementById('resumen-input');
  if (resumenInput) {
    resumenInput.addEventListener('input', () => {
      const text = resumenInput.value.trim();
      const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
      const countEl = document.getElementById('resumen-word-count');
      const statusEl = document.getElementById('resumen-status');
      if (countEl) {
        countEl.textContent = `${words} / 70–90 palabras`;
      }
      if (statusEl) {
        if (words === 0) {
          statusEl.className = 'text-sm text-[#5C4B40]';
          statusEl.textContent = 'Напиши 70–90 слов на испанском';
        } else if (words < 70) {
          statusEl.className = 'text-sm font-medium text-[#B45309]';
          statusEl.textContent = `Нужно ещё ${70 - words} слов (минимум 70)`;
        } else if (words <= 90) {
          statusEl.className = 'text-sm font-semibold text-[#15803D]';
          statusEl.textContent = '✓ В норме (70–90 слов)';
        } else {
          statusEl.className = 'text-sm font-semibold text-[#B91C1C]';
          statusEl.textContent = `✕ Сократи на ${words - 90} слов (максимум 90)`;
        }
      }
    });
  }

  // Ex 6 classification selects & checklist
  app.addEventListener('change', (e) => {
    const target = e.target;
    if (target instanceof HTMLSelectElement && target.hasAttribute('data-ex6-select')) {
      const key = target.getAttribute('data-ex6-select');
      if (key) state.ex6ClassAnswers[key] = target.value;
    }
    if (target instanceof HTMLInputElement && target.hasAttribute('data-check-idx')) {
      const idx = parseInt(target.getAttribute('data-check-idx') || '-1', 10);
      if (idx >= 0 && idx < state.checklist.length) {
        state.checklist[idx] = target.checked;
        saveChecklist();
        const counter = document.getElementById('checklist-counter');
        if (counter) {
          counter.textContent = `${state.checklist.filter(Boolean).length}/${CHECKLIST_ITEMS.length}`;
        }
      }
    }
  });
}

renderApp();
