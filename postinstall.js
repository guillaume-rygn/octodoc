import exec from "child_process"

exec('npm ls -g docsify', (error, stdout, stderr) => {
  if (error || stderr) {
    // docsify n'est pas installé globalement, alors on l'installe
    console.log('Installation de docsify...');
    exec('npm install -g docsify', (error, stdout, stderr) => {
      if (error || stderr) {
        console.error('Erreur lors de l\'installation de docsify :', error || stderr);
      } else {
        console.log('docsify a été installé avec succès.');
      }
    });
  } else {
    console.log('docsify est déjà installé globalement.');
  }
});