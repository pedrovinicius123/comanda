const confirmPasswordEquals = () => {
    const passVal = document.getElementById("senha").value
    const passConfirm = document.getElementById("confirmacaoSenha")
    if (passConfirm !== null){
        if (passVal !== passConfirm.value){
            window.alert("Passwords does not match");

        }

    }

}
