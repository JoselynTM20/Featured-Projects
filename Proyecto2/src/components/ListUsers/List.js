const List = ({data}) => {
    return (
        <div className="list">
            <ul>
               {data.map((user)=>(
                    <li key={JSON.stringify(user)}>
                        <div>
                        <p>ID: {user.id}</p>
                        <p>First Name: {user.firstName}</p>
                        <p>Last Name: {user.lastName}</p>
                        <p>Maiden Name: {user.maidenName}</p>
                        <p>Age: {user.age}</p>
                        <p>Gender: {user.gender}</p>
                        <p>Email: {user.email}</p>
                        <p>Phone: {user.phone}</p>
                        <p>Username: {user.username}</p>
                        <p>Password: {user.password}</p>
                        <p>Birth Date: {user.birthDate}</p>
                        <p>Image: {user.image}</p>
                        <p>Blood Group: {user.bloodGroup}</p>
                        <p>Height: {user.height}</p>
                        <p>Weight: {user.weight}</p>
                        <p>Eye Color: {user.eyeColor}</p>
                        <p>Hair Color: {user.hair.color}</p>
                        <p>Hair Type: {user.hair.type}</p>
                        <p>Domain: {user.domain}</p>
                        <p>IP: {user.ip}</p>
                        <p>Address: {user.address.address}</p>
                        <p>City: {user.address.city}</p>
                        <p>Postal Code: {user.address.postalCode}</p>
                        <p>State: {user.address.state}</p>
                        <p>Mac Address: {user.macAddress}</p>
                        <p>University: {user.university}</p>
                        <p>Card Expire: {user.bank.cardExpire}</p>
                        <p>Card Number: {user.bank.cardNumber}</p>
                        <p>Card Type: {user.bank.cardType}</p>
                        <p>Currency: {user.bank.currency}</p>
                        <p>IBAN: {user.bank.iban}</p>
                        <p>Company Address: {user.company.address.address}</p>
                        <p>Company City: {user.company.address.city}</p>
                        <p>Company Postal Code: {user.company.address.postalCode}</p>
                        <p>Company State: {user.company.address.state}</p>
                        <p>Company Department: {user.company.department}</p>
                        <p>Company Name: {user.company.name}</p>
                        <p>Company Title: {user.company.title}</p>
                        <p>EIN: {user.ein}</p>
                        <p>SSN: {user.ssn}</p>
                        <p>User Agent: {user.userAgent}</p>
                        </div>
                    </li>
               ))}
            </ul>
        </div>
    )
}

export default List;