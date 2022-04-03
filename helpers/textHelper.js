module.exports = {
  ubahTipe: function (tipe) {
    switch (tipe) {
      case "short_text":
        return "Teks Singkat"
      case "long_text":
        return "Teks Panjang"
      case "number":
        return "Angka"
      case "date":
        return "Tanggal"
      case "checkbox":
        return "Kotak Centang"
      case "radio":
        return "Pilihan Ganda"
      default:
        return `
        <p class="subtitle is-6">Tipe > ${tipe} < perlu tambahan switch render case di helper</p>
        `
    }
  },
  potongStr: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },
  ubahPertanyaan: function (data, state, tag) {
    let isRo = ''
    let isDis = ''
    let redText = ''
    if (state == 'off') {
      isRo = 'readonly'
      isDis = 'disabled'
      redText = 'has-text-danger'
    }
    let { tipe, teks, opsi, id } = data
    switch (tipe) {
      case 'short_text':
        return `
        <div class="box my-2">
          ${this.cetakTag(data, tag)}
            <div class="title is-6 ${redText}">
              ${teks}
            </div>
            <div class="field">
              <div class="control">
                <input class="input" ${isRo} type="text" name="${id}" placeholder="Jawaban">
              </div>
            </div>
        </div>
        `
      case 'long_text':
        return `
        <div class="box my-2">
          ${this.cetakTag(data, tag)}
            <div class="title is-6 ${redText}">
              ${teks}
            </div>
            <div class="field">
              <div class="control">
                <textarea ${isRo} class="textarea" name="${id}" placeholder="Jawaban"></textarea>
              </div>
            </div>
        </div>
        `
      case "number":
        return `
        <div class="box my-2">
          ${this.cetakTag(data, tag)}
            <div class="title is-6 ${redText}">
              ${teks}
            </div>
            <div class="field">
              <div class="control">
                <input class="input" ${isRo} type="number" name="${id}" placeholder="Jawaban">
              </div>
            </div>
        </div>
        `
      case "date":
        return `
        <div class="box my-2">
          ${this.cetakTag(data, tag)}
            <div class="title is-6 ${redText}">
              ${teks}
            </div>
            <div class="field">
              <div class="control">
              <input ${isRo} type="date" name="${id}" >
              </div>
            </div>
        </div>
        `
      case "radio":
        let opsiR = opsi.map((el) => {
          return `
          <div class="field">
            <label class="b-radio radio">
              <input type="radio" ${isDis} name="[${id}][${el}]" >
              <span class="check"></span>
              <span class="control-label">${el}</span>
            </label>
          </div>
          `
        }).join('')
        return `
        <div class="box my-2 has-text-left">
          ${this.cetakTag(data, tag)}
            <div class="title is-6 has-text-centered ${redText}">
              ${teks} 
            </div>
            ${opsiR}
        </div>
        `
      case "checkbox":
        let opsiC = opsi.map((el) => {
          return `
          <div class="field">
            <label class="b-checkbox checkbox" >
              <input type="checkbox" ${isDis} name="${id}[${el}]" >
              <span class="check"></span>
              <span class="control-label">${el}</span>
            </label>
          </div>
          `
        }).join('')
        return `
        <div class="box my-2 has-text-left">
          ${this.cetakTag(data, tag)}
            <div class="title is-6 has-text-centered ${redText}">
              ${teks}
            </div>
            ${opsiC}
        </div>
        `

      default:
        return `
        <p class="subtitle">-Cek kembali-</p>
        `
    }
  },
  cetakTag: function (data, position) {
    let { prioritas, indeks } = data
    switch (position) {
      case 'split':
        return `
        <div class="level mb-2 is-mobile">
          <div class="level-left">
            <div class="control">
              <div class="tags has-addons">
                <span class="tag is-dark is-capitalized">prioritas</span>
                <span class="tag is-info">${prioritas}</span>
              </div>
            </div>
          </div>
          <div class="level-right">
            <div class="control">
              <div class="tags has-addons">
                <span class="tag is-dark is-capitalized">no</span>
                <span class="tag is-success">${indeks}</span>
              </div>
            </div>
          </div>
        </div>
        `

      default:
        return `
        <div class="level mb-2 is-mobile">
          <div class="level-left">
            <div class="field is-grouped is-grouped-multiline">
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark is-capitalized">prioritas</span>
                  <span class="tag is-info">${prioritas}</span>
                </div>
              </div>
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark is-capitalized">no</span>
                  <span class="tag is-success">${indeks}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        `
    }
  }
}