from database import Database


def test():
    Database.clear_history(3)
    Database.add_history_note(3, 'clower, casser, mas', '0.921112, 0.024532111432, 0.00054634', image_path='psadk')
    Database.add_history_note(3, 'casser, clower, mas', '0.921112, 0.024532111432, 0.00054634', image_path='psadk')

    i = 0
    
    while (acc := Database.get_account(i := i + 1)) is not None:
        print(acc)
    
    print('end')


if __name__ == '__main__':
    test()
