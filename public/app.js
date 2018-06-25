// Establish a Socket.io connection
const socket = io()
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers()

client.configure(feathers.socketio(socket))
// Use localStorage to store our login token
client.configure(
  feathers.authentication({
    storage: window.localStorage
  })
)

let filter = {}
let total = 0
let limit = 50
let skip = 0

const loadContracts = async ({ filter, skip = 0 }) => {
  const contracts = await client.service('contracts').find({
    query: {
      $limit: limit,
      $skip: skip,
      ...filter
    }
  })
  total = contracts.total
  limit = contracts.limit
  skip = contracts.skip
  renderPagination(contracts)
  renderContracts(contracts.data)
}

const goToPage = page => {
  console.log(`Skipping to page: ${page}`)
  loadContracts({ filter, skip: (page - 1) * limit })
}

const renderPagination = ({ total, limit, skip }) => {
  console.log(`total ${total}`, `limit ${limit}`, `skip ${skip}`)

  const totalPages = Math.ceil(total / limit)
  const currentPage = skip / limit + 1

  console.log(`\ttotalPages: ${totalPages}`, `currentpage: ${currentPage}`)

  let html = ''

  if (totalPages > 1) {
    if (currentPage !== 1) {
      html += `
  <li class="page-item">
    <a class="page-link" href="#" onClick="goToPage(1)">First</a>
  </li>
  <li class="page-item">
    <a class="page-link" href="#" onClick="goToPage(${currentPage - 1})">
      <span aria-hidden="true">&laquo;</span>
      <span class="sr-only">Previous</span>
    </a>
  </li>
  `
    }

    const maxPages = 8
    let pages = [...Array(currentPage + maxPages).keys()]
    if (currentPage > maxPages / 2) {
      pages = pages.slice(currentPage - maxPages / 2)
    }
    pages = pages.filter(n => n <= totalPages - 1)

    const pagesHTML = pages.map(index => {
      index = index + 1
      const isActive = index === currentPage ? 'active' : ''
      return `
    <li class="page-item ${isActive}">
      <a class="page-link" href="#" onClick="goToPage(${index})">${index}</a>
    </li>
  `
    })

    html += pagesHTML.join('')

    if (currentPage !== totalPages) {
      html += `
  <li class="page-item">
    <a class="page-link" href="#" onClick="goToPage(${currentPage + 1})">
      <span aria-hidden="true">&raquo;</span>
      <span class="sr-only">Next</span>
    </a>
  </li>
  <li class="page-item">
    <a class="page-link" href="#" onClick="goToPage(${totalPages})">Last</a>
  </li>
  `
    }
  }

  Array.from($('#total'))[0].innerHTML = `Total: ${total}`
  Array.from($('#pagination'))[0].innerHTML = html
}

const renderContracts = data => {
  const html = data
    .map(contract => {
      const name = contract.name || contract.address
      const symbol = contract.symbol || ''
      const isERC721 = contract.isERC721 === null ? 'undefined' : contract.isERC721
      return `
      <tr>
        <th scope="row"><a href="https://etherscan.io/address/${contract.address}">${name}</a></th>
        <td>${symbol}</td>
        <td>${isERC721}</td>
        <td>${contract.isERC20}</td>
      </tr>
    `
    })
    .join('')

  $('.table-body')[0].innerHTML = html
}

const setFilter = type => {
  setNav(type)

  if (type === '') {
    filter = {}
    skip = 0
    loadContracts({ filter, skip })
    return
  }

  if (type === 'erc20') {
    filter = {
      isERC20: true
    }
    skip = 0
    loadContracts({ filter, skip })
    return
  }

  if (type === 'erc721') {
    filter = {
      isERC721: true
    }
    skip = 0
    loadContracts({ filter, skip })
    return
  }

  if (type === 'undefined') {
    filter = {
      isERC721: null
    }
    skip = 0
    loadContracts({ filter, skip })
    return
  }
}

const setNav = type => {
  if (type === '') {
    $('#nav-all').addClass('active')
    $('#nav-erc20').removeClass('active')
    $('#nav-erc721').removeClass('active')
    $('#nav-undefined').removeClass('active')
    return
  }

  if (type === 'erc20') {
    $('#nav-all').removeClass('active')
    $('#nav-erc20').addClass('active')
    $('#nav-erc721').removeClass('active')
    $('#nav-undefined').removeClass('active')
    return
  }

  if (type === 'erc721') {
    $('#nav-all').removeClass('active')
    $('#nav-erc20').removeClass('active')
    $('#nav-erc721').addClass('active')
    $('#nav-undefined').removeClass('active')
    return
  }

  if (type === 'undefined') {
    $('#nav-all').removeClass('active')
    $('#nav-erc20').removeClass('active')
    $('#nav-erc721').removeClass('active')
    $('#nav-undefined').addClass('active')
    return
  }
}

window.addEventListener('load', async () => {
  console.log('Loaded')
  loadContracts({ filter, skip })
})
