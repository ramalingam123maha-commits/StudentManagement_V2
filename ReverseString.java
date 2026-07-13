public class ReverseString {
    public static void main(String[] args) {
        String word = "Hello Program";

        // Reverse using StringBuilder
        String reversed = new StringBuilder(word).reverse().toString();

        System.out.println("Original : " + word);
        System.out.println("Reversed : " + reversed);
    }
}
