//原理： 单独创建一个 http.js 或者 http.ts 文件，在文件中引入 axios 并对其进行封装配置，最后将其导出并挂载到 Vue 的原型上即可。
//       采用 axios 官方推荐的，通过配置项创建 axios 实例的方式进行配置封装

// http.js
import axios from 'axios'
// 创建 axios 实例
const service = axios.create({
	// 配置项
	//根据环境设置 baseURL
	baseURL: process.env.NODE_ENV === 'production' ? `/api` : '/api-dev',

	//统一设置请求头  大部分情况下，请求头都是固定的，只有少部分情况下，会需要一些特殊的请求头，所以，
	//在这里，我采用的方案是，将普适性的请求头作为基础配置。当需要特殊请求头时，将特殊请求头作为参数传入，覆盖基础配置
	headers: {
		get: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
			// 在开发中，一般还需要单点登录或者其他功能的通用请求头，可以一并配置进来
		},
		post: {
			'Content-Type': 'application/json;charset=utf-8'
			// 在开发中，一般还需要单点登录或者其他功能的通用请求头，可以一并配置进来
		}
	},

	// 跨域、超时、响应码处理
	// 提供是否允许跨域的属性——withCredentials，以及配置超时时间的属性——timeout，通过这两个属性，可以轻松处理跨域和超时的问题。
	// 提供了 validateStatus 属性，用于定义对于给定的HTTP 响应状态码是 resolve 或 reject promise
	// 由于我在代码里面使用了 async-await，而众所周知，async-await 捕获 catch 的方式极为麻烦，所以，在此处，我选择将所有响应都设为 resolve 状态，统一在 then 处理。
	// 跨域请求时是否需要使用凭证
    withCredentials: true,
    // 请求 30s 超时
    timeout: 30000,
    validateStatus: function () {
        // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
        return true
	},
	


	// axios 中， transformRequest 允许在向服务器发送请求前，修改请求数据；transformResponse 在传递给 then/catch 前，允许修改响应数据,通过这两个钩子，可以省去大量重复的序列化代码。
	// 在向服务器发送请求前，序列化请求数据
    transformRequest: [function (data) {
        data = JSON.stringify(data)
        return data
    }],
    // 在传递给 then/catch 前，修改响应数据
    transformResponse: [function (data) {
        if (typeof data === 'string' && data.startsWith('{')) {
            data = JSON.parse(data)
        }
        return data
    }]
})

// 请求拦截器
// 由于 async-await 中 catch 难以处理的问题，所以将出错的情况也作为 resolve 状态进行处理。但这带来了一个问题，请求或响应出错的情况下，结果没有数据协议中定义的 msg 字段（消息）。
// 所以，我们需要在出错的时候，手动生成一个符合返回格式的返回数据。
// 由于，在业务中，没有需要在请求拦截器中做额外处理的需求，所以，请求拦截器的 resolve 状态，只需直接返回就可以了。
service.interceptors.request.use((config) => {
    return config
}, (error) => {
    // 错误抛到业务代码
    error.data = {}
    error.data.msg = '服务器异常，请联系管理员！'
    return Promise.resolve(error)
})


// 根据不同的状态码，生成不同的提示信息
const showStatus = (status) => {
    let message = ''
    // 这一坨代码可以使用策略模式进行优化
    switch (status) {
        case 400:
            message = '请求错误(400)'
            break
        case 401:
            message = '未授权，请重新登录(401)'
            break
        case 403:
            message = '拒绝访问(403)'
            break
        case 404:
            message = '请求出错(404)'
            break
        case 408:
            message = '请求超时(408)'
            break
        case 500:
            message = '服务器错误(500)'
            break
        case 501:
            message = '服务未实现(501)'
            break
        case 502:
            message = '网络错误(502)'
            break
        case 503:
            message = '服务不可用(503)'
            break
        case 504:
            message = '网络超时(504)'
            break
        case 505:
            message = 'HTTP版本不受支持(505)'
            break
        default:
            message = `连接出错(${status})!`
    }
    return `${message}，请检查网络或联系管理员！`
}


// 响应拦截器
service.interceptors.response.use((response) => {
    const status = response.status
    let msg = ''
    if (status < 200 || status >= 300) {
        // 处理http错误，抛到业务代码
        msg = showStatus(status)
        if (typeof response.data === 'string') {
            response.data = { msg }
        } else {
            response.data.msg = msg
        }
    }
    return response
}, (error) => {
    // 错误抛到业务代码
    error.data = {}
    error.data.msg = '请求超时或服务器异常，请检查网络或联系管理员！'
    return Promise.resolve(error)
})