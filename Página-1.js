try {

    const db = firebase.firestore();

    firebase.auth().onAuthStateChanged(function (user) {

      db.collection("usuarios(Site)").where("uid", "==", user.uid).get()
        .then((docRef) => {

          docRef.forEach(doc => {

            db.collection("usuarios(Site)").doc(doc.id).collection("perfis").get()
              .then((docRef) => {
                docRef.forEach(doc => {
                  if (doc.data().perfil === "padrão") {

                    window.location.href = "http://127.0.0.1:5500/cadastro/Principal.html";

                  } else {

                    window.location.href = "https://cadastro-notificacao.netlify.app/";
                  }

                });
              })
              .catch((error) => {
                alert(error.message);
              });
          });
        })
        .catch((error) => {

          alert(error.message);
        })
    })

    class Login {
      constructor(email, senha) {

        this.email = email;
        this.senha = senha;
      }

      logar() {

        document.querySelector("div[class='container-loader']").style.display = "block";

        firebase.auth().signInWithEmailAndPassword(this.email, this.senha)
          .then((userCredential) => {

            const userr = userCredential.user;
            const uid = userr.uid;

            db.collection("usuarios(Site)").where("uid", "==", uid).get()
              .then((docRef) => {

                docRef.forEach(doc => {

                  const id = doc.id;

                  db.collection("usuarios(Site)").doc(id).collection("perfis").get()
                    .then((docRef) => {

                      docRef.forEach(doc => {

                        if (doc.data().perfil === "padrão") {

                          document.querySelector("div[class='container-loader']").style.display = "none";
                          window.location.href = "http://127.0.0.1:5500/cadastro/Principal.html";

                        } else {

                          document.querySelector("div[class='container-loader']").style.display = "none";
                          localStorage.setItem("s", "ola");
                          window.location.href = "https://cadastro-notificacao.netlify.app/";

                        }

                      });

                    })
                    .catch((error) => {
                      alert(error.message);
                    });

                });

              })
              .catch((error) => {
                alert(error.message);
              });
          })
          .catch((error) => {

            document.querySelector("div[class='container-loader']").style.display = "none";

            if (error.code == "auth/user-not-found" || error.code == "auth/invalid-email" || error.code == "auth/configuration-not-found") {

              alert("Email invalido");

            } else if (error.code == "auth/wrong-password") {

              if (confirm("Senha invalida\nDeseja recuperar sua conta?") === true) {

                firebase.auth().sendPasswordResetEmail(this.email)
                  .then(() => {
                    alert("Email enviado com sucesso");
                  })
                  .catch((error) => {

                    alert(error.message);

                  });
              }
            } else if (error.code == "auth/too-many-requests") {

              if (confirm("Devido a muitas tentativas de login com falha sua conta foi temporariamente desativada\nDeseja alterar sua senha para recuperar sua conta?") === true) {

                firebase.auth().sendPasswordResetEmail(this.email)
                  .then(() => {
                    alert("Email enviado com sucesso");
                  })
                  .catch((error) => {

                    alert(error.message);

                  });
              }

            } else {
              alert(error.message);
            }
          });
      }
    }

    document.querySelector("input[type='submit']").addEventListener("click", function () {

      const formdata = new FormData(document.querySelector('form'));
      const email = formdata.get("email").replace(/ /g, "");
      const senha = formdata.get("senha").replace(/ /g, "");

      if (email.length == 0 || senha.length == 0) {

        alert('Preencha todos os campos');
      } else {

        var user = new Login(email, senha);
        user.logar();
      }
    });

  } catch (err) {

    alert('Erro ' + err);

  }