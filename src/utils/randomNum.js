export default function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
