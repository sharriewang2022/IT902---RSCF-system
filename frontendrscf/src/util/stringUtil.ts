export function getRandomNumber(nlength:any) {
    var resultNumber = '';
    var stringChooose = '0123456789';
    var vLength = stringChooose.length;
    for (var i = 0; i < nlength; i++) {
        resultNumber += stringChooose.charAt(Math.floor(Math.random() * vLength));
    }
    return resultNumber;
  }