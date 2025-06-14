export const zh = {
  auth: {
    login: '登录',
    register: '注册',
    
    // Independent login page
    loginTitle: '登录',
    loginSubtitle: '欢迎来到绘之间',
    emailPlaceholder: '邮箱地址',
    passwordPlaceholder: '密码',
    loginButton: '登录',
    forgotPassword: '忘记密码？',
    or: '或',
    googleLogin: '使用 Google 继续',
    xLogin: '使用 X 继续',
    registerPrompt: '还没有账户？',
    registerLink: '立即注册',
    
    // Modal
    modalTitle: '需要登录',
    modalDescription: '点赞和购买需要先登录账户。',
    loginNow: '立即登录',
    later: '稍后',
    firstTime: '第一次使用？',
    createAccount: '免费创建账户',
    
    // Validation & errors
    emailRequired: '请输入邮箱地址',
    emailInvalid: '请输入有效的邮箱地址',
    passwordRequired: '请输入密码',
    loginFailed: '邮箱或密码错误',
    genericError: '发生错误，请稍后重试',
    
    // Success
    loginSuccess: '登录成功！',
    redirecting: '正在返回原页面…',
    
    // Forgot Password
    forgotPasswordTitle: '忘记密码',
    forgotPasswordDescription: '我们将向您发送密码重置链接',
    sendResetEmail: '发送重置链接',
    emailSent: '邮件已发送',
    checkEmailInstructions: '密码重置链接已发送到您的邮箱',
    backToLogin: '返回登录',
    
    // Reset Password
    resetPasswordTitle: '设置新密码',
    resetPasswordDescription: '请输入您的新密码',
    newPasswordPlaceholder: '新密码',
    confirmPasswordPlaceholder: '确认密码',
    resetPasswordButton: '更新密码',
    passwordResetSuccess: '密码已更新',
    passwordResetSuccessMessage: '您的密码已成功更新',
    redirectingToLogin: '正在跳转到登录页面...',
    passwordMinLength: '密码至少需要6个字符',
    passwordsDoNotMatch: '密码不匹配'
  }
} as const;