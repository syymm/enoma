export const ja = {
  auth: {
    login: 'ログイン',
    register: '新規登録',
    
    // Independent login page
    loginTitle: 'ログイン',
    loginSubtitle: 'ようこそ、絵の間へ',
    emailPlaceholder: 'メールアドレス',
    passwordPlaceholder: 'パスワード',
    loginButton: 'ログイン',
    forgotPassword: 'パスワードをお忘れですか？',
    or: 'または',
    googleLogin: 'Google で続行',
    xLogin: 'X で続行',
    registerPrompt: 'アカウントをお持ちでない方は',
    registerLink: 'こちらで新規登録',
    
    // Modal
    modalTitle: 'ログインが必要です',
    modalDescription: 'いいねや購入を行うにはログインしてください。',
    loginNow: '今すぐログイン',
    later: 'あとで',
    firstTime: '初めてご利用ですか？',
    createAccount: '無料アカウントを作成',
    
    // Validation & errors
    emailRequired: 'メールアドレスを入力してください',
    emailInvalid: '有効なメールアドレスを入力してください',
    passwordRequired: 'パスワードを入力してください',
    loginFailed: 'メールアドレスまたはパスワードが正しくありません',
    genericError: 'エラーが発生しました。しばらくしてから再度お試しください',
    
    // Success
    loginSuccess: 'ログインに成功しました！',
    redirecting: '元のページに戻ります…',
    
    // Forgot Password
    forgotPasswordTitle: 'パスワードを忘れた場合',
    forgotPasswordDescription: 'パスワードリセットのリンクをお送りします',
    sendResetEmail: 'リセットリンクを送信',
    emailSent: 'メールを送信しました',
    checkEmailInstructions: 'パスワードリセットのリンクがメールに送信されました',
    backToLogin: 'ログイン画面に戻る',
    
    // Reset Password
    resetPasswordTitle: '新しいパスワードを設定',
    resetPasswordDescription: '新しいパスワードを入力してください',
    newPasswordPlaceholder: '新しいパスワード',
    confirmPasswordPlaceholder: 'パスワードの確認',
    resetPasswordButton: 'パスワードを更新',
    passwordResetSuccess: 'パスワードが更新されました',
    passwordResetSuccessMessage: 'パスワードの更新が完了しました',
    redirectingToLogin: 'ログイン画面に移動します...',
    passwordMinLength: 'パスワードは6文字以上で入力してください',
    passwordsDoNotMatch: 'パスワードが一致しません'
  }
} as const;